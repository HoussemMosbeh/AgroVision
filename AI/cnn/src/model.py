import torch.nn as nn
from torchvision import models

def build_model(num_classes):
    model = models.efficientnet_b0(weights='IMAGENET1K_V1')

    for param in model.parameters():
        param.requires_grad = False

    in_features = model.classifier[1].in_features
    model.classifier = nn.Sequential(
        nn.Dropout(0.3),
        nn.Linear(in_features, 256),
        nn.ReLU(),
        nn.Dropout(0.2),
        nn.Linear(256, num_classes)
    )
    return model
