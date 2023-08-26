kubernates-yaml --env=qa --name=whatsapp-bot-k8s --operation=deployment --image=itayp/itayp/whatsapp-bot-k8s:6
kubernates-yaml --env=qa --name=whatsapp-bot-k8s --domain=digital-cloud-services.com --operation=Ingress
kubernates-yaml --env=qa --name=whatsapp-bot-k8s --operation=Service

docker build -t itayp/whatsapp-bot-k8s:6 -t itayp/whatsapp-bot-k8s:latest  .
docker push itayp/whatsapp-bot-k8s:6
docker push itayp/whatsapp-bot-k8s:latest

 
kubectl apply -f Deployment.yaml
kubectl apply -f Service.yaml
kubectl apply -f Ingress.yaml