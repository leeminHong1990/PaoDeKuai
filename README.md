<h1 align="center">feixia Engine</h1>

<div align="center">
An chess and card game framework.
</div>

## Env and dependencies

- client-engine:	**Cocos2d-x-3.16**
- client-ui-tools:	**Cocos Studio v3.10**
- server-engine:	**KBEngine v1.17**


- Client Home Page: https://www.cocos.com/
- Server Home Page: https://www.comblockengine.com/
- Server source github Release: https://github.com/kbengine/kbengine/releases
- Server FAQ: https://bbs.comblockengine.com/

## Run

- step 1: 

		download Engine
		
		source:	https://pan.baidu.com/s/1SKrdwEhsIEQX2cvek4wL4A   
		extrace code：y3nf
- step 2: 
		
		unzip frameworks in cocos
		
		source in Engine/cocos_frameworks_v3.16.zip
- step 3:

		unzip kbe in kbengine

		windows: 	Engine/kbe_windows_1.17.zip
		linux: 		Engine/kbe_tencent_ubuntu_1.17.zip
- step 4: 

		1.download [nginx](http://nginx.org)
		2.config nginx like nginx config.
- step 5: 

		config cocos/src/switch.js

		switches.kbeServerIP 		=> server ip 
		switches.kbeServerLoginPort => server port (in general 20013)
- step 6: 
		
		run command
		
		windows:	kbengine/assets/start_server.bat
		linux:		kbengine/assets/start_server.sh
- step 7:
		
		login
		
		1.use explorer Access to the client address 
		2.login the service.

## nginx config
<h6>

	server {
	
		listen       8090;
		
		server_name  YingTanMJ;
		
		location / {
			root   F:/YingTanMJ/cocos;
			#index  index.html index.htm;
			autoindex on;
			add_header Cache-Control no-store;
			expires off;
		}
		
		#location  /frameworks {
		#   root   D:/Engine/;
		#   add_header Cache-Control no-store;
		#   expires off;
		#}
	}
	
</h6>