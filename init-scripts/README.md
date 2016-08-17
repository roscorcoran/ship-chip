The server is managed by the upstart service, the service is configured via [ship-chip.conf](ship-chip.conf), the upstart job will call [setSail.sh](setSail.sh) to start the service (nodejs 
app)

the [pollGit.sh](pollGit.sh) script will be invoked via a cron job, this job will run periodically to manage changes on the device, the script will manage the server via the upstart scripts