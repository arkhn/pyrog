#!/bin/sh


echo "STAGE=.$STAGE
PORT=1729
REACT_APP_HTTP_BACKEND_URL=http://$IP/pyrog-api
REACT_APP_RIVER_URL=http://$IP/river
REACT_APP_PAGAI_URL=http://$IP/pagai
REACT_APP_FHIR_API_URL=http://$IP/api
REACT_APP_CLIENT_ID=pyrog-client
REACT_APP_CLIENT_SECRET=pyrog-client
REACT_APP_AUTH_URL=http://$IP/hydra/oauth2/auth
REACT_APP_TOKEN_URL=http://$IP/hydra/oauth2/token
REACT_APP_REVOKE_URL=http://$IP/hydra/oauth2/revoke
REACT_APP_LOGOUT_URL=http://$IP/hydra/oauth2/sessions/logout
REACT_APP_LOGIN_REDIRECT_URL=http://$IP/pyrog/
REACT_APP_LOGOUT_REDIRECT_URL=http://$IP/pyrog/login
"