import os
import psycopg2
import yaml

configFileName = './conf.custom.yml' if os.path.exists('./conf.custom.yml') else './conf.default.yml'

def main():
    """Initiates connection with distant postgres database."""

    with open(configFileName) as config_file:
        try:
            # Load config
            config = yaml.safe_load(config_file)
            connection = None

            try:
                # Initialise client
                connection = psycopg2.connect(
                    host=config['db_host'],
                    port=config['db_port'],
                    database=config['db_name'],
                    user=config['db_user'],
                    password=config['db_password']
                )

                # Run SQL query
                cursor = connection.cursor()
                cursor.execute("SELECT * from patients limit 10;")
                data = cursor.fetchall()
                print(data)

            except (Exception, psycopg2.Error) as error :
                print ("Error while connecting to PostgreSQL", error)
            finally:
                # Closing database connection.
                if(connection):
                    cursor.close()
                    connection.close()
                    print("PostgreSQL connection is closed")

        except yaml.YAMLError as error:
            print(error)

if __name__ == "__main__":
    main()