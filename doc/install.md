# Installation

    git clone moodlenet.git.com
    yarn

    yarn prepare

from visual studio code, shit+ctrl+b digitare dev-tasks

    cd packages/dev-machine
    yarn start-dev

and open localhost:3000 on browser

## packages dev-machine

questo cartella fornisce il run-time per lo sviluppatore nella cartella .machines in essa troviamo una cartella con un numero in genere 1, eliminandola e ricompilandi si evitano eventuali problemi

aggiunta di packages e loro installazione :

Nella cartelle plugin proviamo i singoli plugin come progetti npm, nei loro files di packages , insieriamo le nuove dipendenze, ma non chiamiamo yarn o npm install dentro alla cartella di progetto del plugin, ma dalla cartella root, lanciamo

yarn bs

questo comando grazie a lerna, permette di installare le dipendenze in tutti i sotto progetti presenti nella cartella packages.

new gen 2023----------------------------

docker run -e ARANGO_NO_AUTH=1 -p 8529:8529 --name=mn3arango arangodb
 docker start mn3arango
  npm  run dev-install-backend prova
 npm  run dev-start-backend prova
  npm  run dev-start-webapp


  devi aggiungere il container al registry
  packages/react-app/src/webapp/ui/components/pages/Settings/Settings/Hook/SettingsHooks.tsx riga **11**