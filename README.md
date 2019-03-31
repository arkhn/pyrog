# Pyrog Server

[![Arkhn](https://img.shields.io/badge/ARKHN-PRODUCT-000000.svg?style=for-the-badge&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABHNCSVQICAgIfAhkiAAABhRJREFUaIHtmVtMU3ccxw+l9H4KlbZQbrI1gcguMsacLJske2IPxCy6RF2m22ByG8gpp5SLiSRNsaWlXAq1UIYYp4kZmcPNLIoxPiwxMzG6kO3JGAKCpcA6Slvac6l7Wd3ZAXoudZ4t2+fx2/5+5/PNnwP0FAD+5z9Gdnb2G1qt9m2uPRLG6XROTUxMTHPtkRCZmZmvYRgWxXE8mp+fX8a1D2uGhoYuP/mDsbGx77n2YYVard6NoigeK4JhWDQvL+9Nrr0YMzg4OPmExMjIyHdcezFCpVK9jCAITi6CYVg0Ozu7lGs/2tjt9kvkEjGcTucVrv1osWPHjl3hcBjbrgiKorhGoynh2pMSq9V6cbsSMRwOx9dce8ZFoVAUhkIhlKoIgiB4ZmZmMde+22I2m89TlYgxMDDwFde+W5KWllYQCAQQukUQBMHVavUrXHtvoru7e4JuiRh2u/0S195/QS6Xa5mcRoxwOIwplcqXuPZ/itFoHGdaIkZPT88Frv0BAAAAEARf8Pv9EbLg4uLiOjlbWFjwb3Uq6enpuxL14CW6QKfTtYEgKCBmHo8n4HK5zpPfOzY2dnFubu43YiYUCpP1en17oh4JFZHJZPk6ne4YOTebzc5IJOIl5wiC+Ewmk4OcNzU1HU5LSytIxCWhIhAEGeRyuZCYeb3eoMvlsm83Mz4+3jc/P79GzMRiMV+v13ck4sK6iEQiyYUg6GNybrFYRiKRyNJ2cxiG+SwWyzA5hyDoQ7lcrmXrw7pIc3OzQaFQiIjZ8vJyyOl0WqlmR0dH7Y8fP14nZmKxmA/DMOt7hVURiUSSA8NwFTm3Wq3ucDjsoZpHUXTVZDJtOpXm5uaPQBB8kY0TqyINDQ0w+TRWV1c3hoaGKE8jhtvt7l1aWgoQMxAEBTqdro2NE+MiIpFIYzAYjpNzm802trGxsUB3D4IgK93d3U5y3tLSckwqleYx9WJcpL6+Hk5PTxcTM5/PFx4cHOxhusvlcvV6vd4gMQNBUABBEON7hVERoVCY2dbWVkvO7Xb72VAo9IjpxREE8VoslhFyDsPwJxKJJJfJLkZFamtrdSqVSkLM1tbWIn19faeZ7CHidDqtKysrIWKWmpoqhCCI0b1Cu4hAIFC3t7fXkfO+vr5zwWBwnslFiYTDYY/FYhkl5y0tLZ+KxeIsuntoF6mpqdFlZGTIiNn6+jrS29vL+jRiDA8P23w+X5iYKRQKUWNjo4HuDlpFUlJSlO3t7fXkvL+//3wgEJile7Ht2NjYWLBYLG5yrtfrq0UikYbODlpFqqurIY1GAxKzYDCI2my2bnqq1Dgcjp61tbUIMVMqlZKGhgY9nXnKInw+X3Hy5MnPyXl/f/8Fv9//kL5qfEKh0COr1foFOW9tbT0uFAozqOYpi1RVVUFZWVlyYhaNRp/Y7fZ+ZqrUOByOIQzDosRMrVZL6+rqYKrZuEX4fH5aR0dH46YhHi9penp6as+ePfuZ625NcXHxe9euXfuWz+dvcmptba0RCASqePNxi5SXl7+fk5OTutVrJSUlO2/fvn35zJkzV0AQ3MlM+0+kUmnOwMDA5N27d6/u3bt3y3/jMzIyZBUVFR+wvQYAAABQVlZ24P79+/PxHiAsLS0Fjhw50gYAwNOPvAaDoYv8vs7OTuKvav7Bgwd1i4uLmz7HE5mZmVnYt2/f4YRKxODxeLITJ070Uj3yuXnz5s+FhYXlVEW0Wu1b169f/ynerlAohMIwPJicnLzlT0RCaDSa3ZOTkz/EE0BRFDeZTOe6urqc5NeMRqP71KlT7q2+OyEyNTX1Y25u7uvPvACJpIqKis8ePHiwEk8Gx/EonYzI7Ozsr5WVlfXAM3i6QxuBQKA0Go1nid8TsgXDsKjZbP6Szt+Lv42CgoJ3bty4McO2xK1bt34pKip6l7MCJFIOHTrU6vF4Nj1d3I7l5eXg0aNHO5OSkoTU658zMpksb3h4+Jt49wKO41G32301NTWV1UOG50ppaWnlnTt3HpJL3Lt3b66srOwA136M4PF40rq6utN+vz8SCASQpqYmG4/HA6kn/6GoVKoijUbzKtce/xp+B+F302hEELoiAAAAAElFTkSuQmCC)](https://arkhn.org/)
[![GitHub license](https://img.shields.io/badge/LICENSE-APACHE2-blue.svg?style=for-the-badge)](https://github.com/arkhn/fhir-pipe/blob/master/LICENSE)

This is a web server for [Pyrog](https://github.com/arkhn/pyrog-client).

## Install in development

Simply run
```
yarn install
env $(cat .env.staging) docker-compose up prisma
prisma deploy
```

This will install all required node dependencies, setup 2 Docker containers (1 Prisma, 1 Postgres), 1 Docker volume (which will persistently contain all data collected in Pyrog) and initiate our Postgres database schema with our GraphQL datamodel.

Some static files are needed to have this server run. Download them manually [here](https://arkhn.org/pyrog_static_files.zip), or run this command:
```
curl https://arkhn.org/pyrog_dev_static_files.zip > pyrog_dev_static_files.zip
unzip pyrog_dev_static_files.zip
rm pyrog_dev_static_files.zip
```

Finally, you can populate your local Postgres database with a real-life example:
```
prisma import --data ./static_files/pyrog_mimic_mapping.zip
```

## Run in development

Once all installation steps succeeded, one can simply start this server with
```
yarn start
```

One can send GraphQL queries to this server using `Playground`:
```
yarn playground
```

## Start contributing

We have reported several issues with the label `Good first issue` which can be a good way to start! You can also join our [Slack](https://join.slack.com/t/arkhn/shared_invite/enQtNTc1NDE5MDIxMDU3LWZmMzUwYWIwN2U0NGI1ZjM2MjcwNTAyZDZhNzcyMWFiYjJhNTIxNWQ1MWY4YmRiM2VhMDY4MDkzNGU5MTQ4ZWM) to contact us if you have trouble or questions :)

If you're enthusiastic about our project, :star: it to show your support! :heart:
