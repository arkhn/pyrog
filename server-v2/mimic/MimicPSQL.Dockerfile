FROM postgres:latest

RUN apt-get update \
    && apt-get install -y wget

WORKDIR /tmp
ARG MIMIC_USER
ARG MIMIC_PASSWORD

RUN wget --user $MIMIC_USER --password $MIMIC_PASSWORD \
    -r -N -c -np  \
    https://alpha.physionet.org/files/mimiciii-demo/1.4/

WORKDIR /mimic_data

RUN mv /tmp/alpha.physionet.org/files/mimiciii-demo/1.4/* .

RUN ls

# WORKDIR /tmp/mimic_scripts
# # Clone MIMIC PostgreSQL build scripts in directory containing scripts executed automatically by PSQL
# RUN git init \
#     && git remote add -f origin https://github.com/MIT-lcp/mimic-code \
#     && git config core.sparseCheckout true \
#     && echo "buildmimic/postgres" >> .git/info/sparse-checkout \
#     && git pull origin master \
#     && cp -r buildmimic/postgres/postgres_*.sql /docker-entrypoint-initdb.d/

WORKDIR /
ADD 0_check_config.sh /docker-entrypoint-initdb.d/
ADD 1_postgres_create_tables.sql /docker-entrypoint-initdb.d/
ADD 2_postgres_load_data.sql /docker-entrypoint-initdb.d/
ADD 3_postgres_add_indexes.sql /docker-entrypoint-initdb.d/
ADD 4_postgres_add_constraints.sql /docker-entrypoint-initdb.d/
