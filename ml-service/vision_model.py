import random

class VisionModel:
    def __init__(self):
        # In a real scenario, this would load a PyTorch model
        # e.g., torchvision.models.mobilenet_v2(pretrained=True)
        self.is_loaded = True
        self.classes = ["slope cracks", "exposed soil", "rockfall", "slope deformation", "blocked roads", "debris", "flooding", "damaged infrastructure", "normal"]

    def predict(self, image_bytes):
        # Mocking inference
        # Select 1-3 random classes
        num_classes = random.randint(1, 3)
        detected = random.sample(self.classes[:-1], num_classes)
        
        # Sometimes return normal
        if random.random() > 0.8:
            detected = ["normal"]
            
        results = []
        severity_score = 0
        for cls in detected:
            conf = random.uniform(0.6, 0.99)
            results.append({
                "class": cls,
                "confidence": round(conf, 2)
            })
            if cls != "normal":
                severity_score += conf
                
        severity = "LOW"
        if severity_score > 1.5:
            severity = "CRITICAL"
        elif severity_score > 0.8:
            severity = "HIGH"
            
        return {
            "detected_objects": results,
            "image_classification": detected[0] if detected else "unknown",
            "severity_estimate": severity,
            "disclaimer": "Prototype Deep Learning CV module. Not scientifically validated."
        }
