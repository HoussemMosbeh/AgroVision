package com.example.demo.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class soilRequestDTO 
{
    public static class Request
    {
        private BigDecimal ph;
        private BigDecimal azote;
        private BigDecimal phosphore;
        private BigDecimal potassium;
        private BigDecimal humidite;
        private BigDecimal matiere_organique;
        private BigDecimal temperature;

        public BigDecimal getPh()
        {
            return ph;
        }

        public void setPh(BigDecimal ph)
        {
            this.ph = ph;
        }

        public BigDecimal getAzote()
        {
            return azote;
        }

        public void setAzote(BigDecimal azote)
        {
            this.azote = azote;
        }

        public BigDecimal getPhosphore()
        {
            return phosphore;
        }

        public void setPhosphore(BigDecimal phosphore)
        {
            this.phosphore = phosphore;
        }

        public BigDecimal getPotassium()
        {
            return potassium;
        }

        public void setPotassium(BigDecimal potassium)
        {
            this.potassium = potassium;
        }

        public BigDecimal getHumidite()
        {
            return humidite;
        }

        public void setHumidite(BigDecimal humidite)
        {
            this.humidite = humidite;
        }

        public BigDecimal getMatiereOrganique()
        {
            return matiere_organique;
        }

        public void setMatiereOrganique(BigDecimal matiere_organique)
        {
            this.matiere_organique = matiere_organique;
        }

        public BigDecimal getTemperature()
        {
            return temperature;
        }

        public void setTemperature(BigDecimal temperature)
        {
            this.temperature = temperature;
        }
    }

    public static class Response
    {
        private Long id;
        private Long terrainId;
        private BigDecimal ph;
        private BigDecimal azote;
        private BigDecimal phosphore;
        private BigDecimal potassium;
        private BigDecimal humidite;
        private BigDecimal matiere_organique;
        private BigDecimal temperature;
        private LocalDateTime dateMesure;

        public Long getid()
        {
            return id;
        }

        public void setId(Long id)
        {
            this.id = id;
        }

        public Long getTerrainId()
        {
            return terrainId;
        }

        public void setTerrainid(Long terrainId)
        {
            this.terrainId = terrainId;
        }

        public BigDecimal getPh()
        {
            return ph;
        }

        public void setPh(BigDecimal ph)
        {
            this.ph = ph;
        }

        public BigDecimal getAzote()
        {
            return azote;
        }

        public void setAzote(BigDecimal azote)
        {
            this.azote = azote;
        }

        public BigDecimal getPhosphore()
        {
            return phosphore;
        }

        public void setPhosphore(BigDecimal phosphore)
        {
            this.phosphore = phosphore;
        }

        public BigDecimal getPotassium()
        {
            return potassium;
        }

        public void setPotassium(BigDecimal potassium)
        {
            this.potassium = potassium;
        }

        public BigDecimal getHumidite()
        {
            return humidite;
        }

        public void setHumidite(BigDecimal humidite)
        {
            this.humidite = humidite;
        }

        public BigDecimal getMatiereOrganique()
        {
            return matiere_organique;
        }

        public void setMatiereOrganique(BigDecimal matiere_organique)
        {
            this.matiere_organique = matiere_organique;
        }

        public BigDecimal getTemperature()
        {
            return temperature;
        }

        public void setTemperature(BigDecimal temperature)
        {
            this.temperature = temperature;
        }
        
        public LocalDateTime getDateMesure()
        {
            return dateMesure;
        }

        public void setDateMesure(LocalDateTime dateMesure)
        {
            this.dateMesure = dateMesure;
        }
    }
}
