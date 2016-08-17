The server is managed by the systemctl service, the service is configured via [shipchip.service](shipchip.service), the system job will call [setSail.sh](setSail.sh) to start the 
service (nodejs app)

The [pollGit.sh](pollGit.sh) script will be invoked via a cron job, this job will run periodically to manage changes on the device, the script will manage the server via the 
upstart scripts

```bash
cp systemctl.service /etc/systemd/system/
systemctl enable shipchip.service
systemctl start shipchip.service
```

```cron
*/15 * * * * /opt/ship-chip/init-scripts/pollGit.sh
```