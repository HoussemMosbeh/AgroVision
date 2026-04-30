# AgroVision
AgroVision est une application web basée sur l’intelligence artificielle combinant :  Analyse d’images de feuilles et cultures par réseaux neuronaux convolutionnels  Modèle prédictif de rendement basé sur données climatiques et historiques  Tableau de bord interactif pour suivi en temps réel 


# Usage

cd ~/AgroVision/FrontEnd
npm install
npm run dev

cd ~/AgroVision/BackEnd/AgroVision
mvn spring-boot:run

cd ~/AgroVision/AI/cnn
unvicorn src.predict:app --host 0.0.0.0 --port 8000

cd ~/AgroVision/AI/xgboost
uvicorn predict:app --host 0.0.0.0 --port 8001
