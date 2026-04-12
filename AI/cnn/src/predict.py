from fastapi import FastAPI, UploadFile, File, HTTPException
import torch
import torch.nn.functional as F
from torchvision import transforms
from PIL import Image
import io
import json
from src.model import build_model

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
with open("models/saved/class_names.json") as f:
    CLASS_NAMES = json.load(f)

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = build_model(len(CLASS_NAMES))
model.load_state_dict(torch.load("models/saved/plant_disease_model.pth", map_location=DEVICE))
model.to(DEVICE)
model.eval()

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],
                         [0.229, 0.224, 0.225])
])

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if file.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(status_code=400, detail="Invalid image format")

    contents = await file.read()
    img = Image.open(io.BytesIO(contents)).convert("RGB")
    tensor = transform(img).unsqueeze(0).to(DEVICE)

    with torch.no_grad():
        outputs = model(tensor)
        probs = F.softmax(outputs, dim=1)[0]

    idx = probs.argmax().item()
    top5_idx = probs.topk(5).indices.tolist()

    return {
        "disease": CLASS_NAMES[idx],
        "confidence": float(probs[idx]),
        "top5": {CLASS_NAMES[i]: float(probs[i]) for i in top5_idx}
    }
