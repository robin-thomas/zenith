#!/bin/bash

npm run migration --file=migrations/2_delete_table_campaign.ts 
npm run migration --file=migrations/1_create_table_campaign.ts
npm run migration --file=migrations/4_delete_table_click.ts
npm run migration --file=migrations/3_create_table_click.ts 
