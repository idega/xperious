BUILD
===

1. Use `optimize`profile when building for deployment.

		mvn -o -U -Poptimize clean package

2. If you want to run application locally just run the following command and start tomcat server with context pointed to `target` dir:

		mvn -o -U clean package


RUN
===
### mysql
1. Copy `msql java connector` jar to `$TOMCAT/lib` folder.

2. Create database `xperious`.

### tomcat

1. Make sure your `$TOMCAT/conf/Catalina/localhost/ROOT.xml` is alike:

		<Context path="" docBase="/Users/smac/repo/idega5/xperious/target/xperious-5.0.0-SNAPSHOT/" reloadable="false" debug="0" swallowOutput="true" liveDeploy="false">
			<Resource name="jdbc/DefaultDS" type="javax.sql.DataSource"
			  url="jdbc:mysql://localhost/xperious?autoReconnect=true"
			  driverClassName="com.mysql.jdbc.Driver"
			  username="username"
			  password="password"
			  maxActive="20"
			  maxIdle="5"
			  maxWait="10000"
			  removeAbandoned="true"
			  removeAbandonedTimeout="300"
			  logAbandoned="true"
			  testOnBorrow="true"
			  validationQuery="SELECT 1"/>
	    </Context>

2. Set tomcat HTTP connector `URIEncoding` to `UTF-8` in `server.xml` file:

		<Connector port="8080" protocol="HTTP/1.1"
			connectionTimeout="20000"
			redirectPort="8443"
			URIEncoding="UTF-8" />


### lucene
1. Create directory for the lucene index:

		sudo mkdir -p /var/lucene/indexes

2. Change permissions:

		sudo chown -R yourusername /var/lucene/indexes

### jackrabbit
1. Create JCR directory:

		sudo mkdir -p /var/jcr/xperious

2. Change JCR directory permissions:

		sudo chown -R yourusername /var/jcr/xperious

3. Modify `JAVA_OPTS` in `tomcat/startup.sh`. Add the following parameter:

		-Didegaweb.jcr.home=/var/jcr/xperious

4. Make sure that application is configured with the proper image host address. Check property `com.idega.travel.image_host` under Idega workspace. For local setup it should be:

		com.idega.travel.image_host = http://localhost:8080


### jvm
1. Modify `JAVA_OPTS` in `tomcat/startup.sh`. Consider using the following value:

		export JAVA_OPTS=" -Xmx2048M -XX:MaxPermSize=512M -XX:+CMSClassUnloadingEnabled -XX:+CMSPermGenSweepingEnabled -Djava.awt.headless=true -Dfile.encoding=UTF-8 -XX:+HeapDumpOnOutOfMemoryError -XX:MinHeapFreeRatio=20 -XX:MaxHeapFreeRatio=40 -Xdebug -Xnoagent -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=10008 -Didegaweb.jcr.home=/var/jcr/xperious -Dorg.apache.jackrabbit.version.recovery=true"

### httpd (optional)
You can run xperious without the http server. Just use direct tomcat url like `localhost:8080`. But if you want to mimic production environment then configure your http server by following this guide.


1. Create `/etc/httpd/conf/workers.properties` for `jk_module` :

		worker.list=worker1
		worker.worker1.type=ajp13
		worker.worker1.port=8101
		worker.worker1.host=localhost
		worker.worker1.lbfactor=1

2. Install and load `jk_module` in `httpd.conf` module:

		LoadModule jk_module modules/mod_jk.so
		JkWorkersFile /etc/httpd/conf/workers.properties
		JkLogFile     /var/log/httpd/mod_jk_log
		JkLogLevel    info


3. Add `VirtualHost` configuration to `httpd.conf`:

		<VirtualHost core.test.xperious.com:80>
		    ServerName core.test.xperious.com
		    ErrorLog /var/log/httpd/xperiouscoretest_error_log
		    CustomLog /var/log/httpd/xperiouscoretest_log combined
		    JkMount /* worker1
		    DocumentRoot /home/idegaweb/tomcat/core.test.xperious.com/webapps/ROOT
		    DirectoryIndex index.html index.html.var index.jsp
		    <Location /pkiauth>
		        Deny from all
		    </Location>
		    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/x-javascript application/javascript
		    ErrorDocument 500 "Internal server error"
		    ErrorDocument 503 "Service unavailable - we will be back in a minute"
		</VirtualHost>

	Make sure that `NameVirtualHost` directive is present in your `httpd.conf` because otherwise name-based virtual hosts might not be working.


Performance improvements
===
### apache httpd
1. Enable gzip compression for mod_jk. Add the following value to the virtual host configuration file (somewhere under `/etc/httpd/conf.d/`). Make sure the `LoadModule deflate_module modules/mod_deflate.so` is present inside the main http.conf file. To verify that deflation works check headers in browser. You should see `Content-Encoding:gzip` in response.

		<IfModule mod_deflate.c>
			AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/x-javascript application/javascript
		</IfModule>

2. Make sure `Keep-Alive` connections are enabled. Set the following settings under `/etc/httpd/conf/httpd.conf`. To verify that `Keep-Alive` works check headers in browser. You should see `Connection:Keep-Alive` in response.

		KeepAlive On
		MaxKeepAliveRequests 100
		KeepAliveTimeout 15
		


