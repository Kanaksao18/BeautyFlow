SELECT 'CREATE DATABASE beautyflow_auth' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'beautyflow_auth')\gexec
SELECT 'CREATE DATABASE beautyflow_artist' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'beautyflow_artist')\gexec
SELECT 'CREATE DATABASE beautyflow_booking' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'beautyflow_booking')\gexec
SELECT 'CREATE DATABASE beautyflow_notification' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'beautyflow_notification')\gexec
