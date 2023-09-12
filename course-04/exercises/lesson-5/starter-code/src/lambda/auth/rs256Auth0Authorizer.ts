import { CustomAuthorizerEvent, CustomAuthorizerResult } from "aws-lambda";
import "source-map-support/register";

const cert = `-----BEGIN CERTIFICATE-----
MIIDHTCCAgWgAwIBAgIJSC67e5ZD06L+MA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNV
BAMTIWRldi1pdTNiZ3pjOHBpeHRia2YwLnVzLmF1dGgwLmNvbTAeFw0yMzA5MTEx
NDMxNTRaFw0zNzA1MjAxNDMxNTRaMCwxKjAoBgNVBAMTIWRldi1pdTNiZ3pjOHBp
eHRia2YwLnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
ggEBALrhXNvPcD4mtZMIUscCMCVVkOILWziIqdyuu9YHRZm6gBp/pdMCY6Z3OW6Y
QCESJdsHPpF+NYM+/AO0eD5n+tSO6mE3T4q9pnyFH23zQdemItWbCdinFJRPwKoR
hRDNvfvG/fimUzmWMiC7rgT87JDZn8HUKff7s2j7at8DXnE6jb7Y/zwK3JqJjwm7
ibDGqL720LM4TCd+KbPJl36EfS/fUcZ2ky074jP7zTt42tEAvJyiodfUnxquTy+S
ighs+DtsQe+i6iVP0bRx1mgIs6FRTogISKWYCcX00Nh5rcJxpIV9TiVCWTxadVxa
+FeiHCAJ0lZXVxq67isHi9mZmzcCAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAd
BgNVHQ4EFgQU7u5a8MxSDAYToqnzd0ecrFzCmj8wDgYDVR0PAQH/BAQDAgKEMA0G
CSqGSIb3DQEBCwUAA4IBAQAIWmsUtEwesDiv9lWNVU80Ag2eN6XO4FxlUMa/1M+t
9eCFp2VwTrn7owYlXK/uA9j6NZIrINvXpWjrYmRj5YnKAqkl3/4Igpj3zkpZbw0s
LOMp6Gkd6KDqPkM8nYUX+/YJze/lS5xkFbb0kFmgUvbqL4RF8Gc/UEZQ5Gf3YlXU
e9ebAEfsc3/Daae4x1KaGRuWvECpVefHSbnX36LxDHxWhXvNVMMTpbECpv90vnRl
LchjhWS7TerPVqu/0tiE2BVwg6EXkjlvoTs3Uu3udHRzuZjTtWg9bPoydX/l6uJj
Vsy2RNzTkBSzSmRUfoqfdVe+N20Nby4Uvf79IqkxjaI1
-----END CERTIFICATE-----`;

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  try {
    const jwtToken = verifyToken(event.authorizationToken)
    console.log('User was authorized', jwtToken)
  }
};
