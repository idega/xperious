BUILD
===
Javascript resources are optimized during the build process (if you use `-Poptimize`). Make sure that you have
performed the following steps:

1. Install nodejs:

		brew install node

2. From `src/main/portal/` directory execute the following command:

		npm install

3. Use `optimize` profile when building with Maven:

		mvn -o -U -Poptimize clean install

RUN
===
You will need to create the following directories. Also make sure that they have required
permissions to write:

### mysql
1. Copy `msql java connector` jar to `$TOMCAT/lib` folder.

2. Create database `xperious`.

2. Make sure your `$TOMCAT/conf/Catalina/localhost/ROOT.xml` is alike:

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

### jvm
1. Modify `JAVA_OPTS` in `tomcat/startup.sh`. Consider using the following value:

		export JAVA_OPTS=" -Xmx2048M -XX:MaxPermSize=512M -XX:+CMSClassUnloadingEnabled -XX:+CMSPermGenSweepingEnabled -Djava.awt.headless=true -Dfile.encoding=UTF-8 -XX:+HeapDumpOnOutOfMemoryError -XX:MinHeapFreeRatio=20 -XX:MaxHeapFreeRatio=40 -Xdebug -Xnoagent -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=10008 -Didegaweb.jcr.home=/var/jcr/xperious -Dorg.apache.jackrabbit.version.recovery=true"


Performance improvements
===
### apache httpd
1. Enable gzip compression for mod_jk (if using http server). Add the following value to the virtual host configuration file (somewhere under `/etc/httpd/conf.d/`). Make sure the `LoadModule deflate_module modules/mod_deflate.so` is present inside the main http.conf file.

		<IfModule mod_deflate.c>
			AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/x-javascript application/javascript
		</IfModule>
