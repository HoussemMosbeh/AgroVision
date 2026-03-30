import json
import torch
import torch.nn as nn
from torch.optim import Adam
from dataset import get_loaders
from model import build_model

if __name__ == '__main__':
    TRAIN_DIR = "../data/PlantVillage-Dataset/data/train"
    VAL_DIR   = "../data/PlantVillage-Dataset/data/val"
    DEVICE    = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    print(f"Using device: {DEVICE}")

    train_loader, val_loader, class_names = get_loaders(TRAIN_DIR, VAL_DIR)
    num_classes = len(class_names)
    print(f"Classes: {num_classes}")

    with open("../models/saved/class_names.json", "w") as f:
        json.dump(class_names, f)

    model = build_model(num_classes).to(DEVICE)
    criterion = nn.CrossEntropyLoss()

    def train_epoch(loader, optimizer):
        model.train()
        total, correct, loss_sum = 0, 0, 0
        for images, labels in loader:
            images, labels = images.to(DEVICE), labels.to(DEVICE)
            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            loss_sum += loss.item()
            correct  += (outputs.argmax(1) == labels).sum().item()
            total    += labels.size(0)
        return loss_sum / len(loader), correct / total

    def val_epoch(loader):
        model.eval()
        total, correct, loss_sum = 0, 0, 0
        with torch.no_grad():
            for images, labels in loader:
                images, labels = images.to(DEVICE), labels.to(DEVICE)
                outputs = model(images)
                loss = criterion(outputs, labels)
                loss_sum += loss.item()
                correct  += (outputs.argmax(1) == labels).sum().item()
                total    += labels.size(0)
        return loss_sum / len(loader), correct / total

    optimizer = Adam(model.classifier.parameters(), lr=1e-3)
    print("\n--- Phase 1: Training head ---")
    for epoch in range(10):
        tl, ta = train_epoch(train_loader, optimizer)
        vl, va = val_epoch(val_loader)
        print(f"Epoch {epoch+1:02d} | train_loss={tl:.4f} acc={ta:.4f} | val_loss={vl:.4f} acc={va:.4f}")

    print("\n--- Phase 2: Fine-tuning ---")
    for param in model.parameters():
        param.requires_grad = True

    optimizer = Adam(model.parameters(), lr=1e-5)
    for epoch in range(10):
        tl, ta = train_epoch(train_loader, optimizer)
        vl, va = val_epoch(val_loader)
        print(f"Epoch {epoch+1:02d} | train_loss={tl:.4f} acc={ta:.4f} | val_loss={vl:.4f} acc={va:.4f}")

    torch.save(model.state_dict(), "../models/saved/plant_disease_model.pth")
    print("Model saved.")