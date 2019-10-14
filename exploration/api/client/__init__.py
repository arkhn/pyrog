import os
import psycopg2
import yaml

connection = None
cursor = None
configFileName = './conf.custom.yml' if os.path.exists('./conf.custom.yml') else './conf.default.yml'


def resetConnection():
    """Resets connection variables."""

    global connection
    connection = None
    global cursor
    cursor = None


def connect():
    """Inits connection variables ;
    starts connection to distant PostgreSQL database"""

    resetConnection()
    global connection
    global cursor

    if not connection or not cursor:
        with open(configFileName) as configFile:
            try:
                # Load config
                config = yaml.safe_load(configFile)

                try:
                    # Initialise client
                    connection = psycopg2.connect(
                        host=config['db_host'],
                        port=config['db_port'],
                        database=config['db_name'],
                        user=config['db_user'],
                        password=config['db_password']
                    )

                    cursor = connection.cursor()

                except (Exception, psycopg2.Error) as error :
                    print ("Error while connecting to PostgreSQL", error)

            except yaml.YAMLError as error:
                print(error)

    return connection, cursor


def closeConnection():
    """Closes open connection."""

    if connection:
        cursor.close()
        connection.close()
        print("PostgreSQL connection is closed")