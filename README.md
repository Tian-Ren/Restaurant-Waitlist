# Restaurant  Waitlist

Restaurant  Waitlist is a server-less web application based on AWS services. It helps  to  manage  the  tables  available  in  a  restaurant. It  will  assign  tables  to  appropriate  customer  on  the  waitlist  according  to  the  table  capacity.

## Features

The  service  is  a  simplified  version  which  only  supports  one  restaurant. A static website  will  show  the  current  waiting  list  state  and  allow  restaurant  staff  to  add  customer and update customer status.

## AWS Services
### AWS  Lambda:
?Add  customer  to  waiting  list
?Invoke  SNS  
### API  Gateway
?Expose  API  on  top  of  Lambda
### DynamoDB:
?Maintain  waitlist
?Store  customer  info  (name,  phone,  etc.)
###SNS:
?Send notification text message
###S3:
?Host a static website

## Architecture
![architecture](https://cloudcraft.co/view/3be087ce-2231-487a-97e7-631a61b5b401?key=chWPeGfNgEU5UTqNGXXJDA&embed=true)

## Scalability
Lambda,  S3, SNS,  API  Gateway  and  DynamoDB automatically  scale  to  handle  changes  in  load,  without  needing  to  provision  extra  capacity. 
The  architecture  will  need  to  be  modified  to  support  real  business  scenario,  taken concurrency  and  performance  issues  into  consideration. 

## Demo
https://s3.amazonaws.com/cmsc389l-tianren-final-project-website/index.html


