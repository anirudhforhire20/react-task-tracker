//react task manager JSON API server
const http = require('http');
const { URLSearchParams } = require('url');
const Tasks = require('./db.parser').Tasks;
const User = require('./db.parser').User;

//tasks object
let t1 = new Tasks();

//request handler
//only capable of handling GET POST DELETE with content-Type = json
const requestHandler = (req, res) => {
    //here is a list of functions the server will perform
    //1. Signin (101)
    //2. create tasks (102)
    //3. delete tasks (103)
    //4. get tasks (104)
    //5. change task status (105)
    //6. reassign tasks (106)
    //those numbers are query codes


    //assist functions
    function sendJSON(json)
    {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(json));
    }

    function denyReq()
    {
        console.log('request denied');
        res.writeHead(404);
        res.end();
    }




    let qid = new URLSearchParams(req.url).get('qid');

    //every query has to have credentials
    //only in case of 101 will the API accept the creds
    let uname = new URLSearchParams(req.url.split('/')[1]).get('uname');
    let pass = new URLSearchParams(req.url).get('pass');
    console.log(uname)
    if(uname && pass)
    {
        if(qid != '101')
        {
            let snapshot = User.getName(uname);
            if(Object.keys(snapshot).length == 0)
            {
                //user doesn't exist
                denyReq();
            }
            else
            {
                //authentication
                if(snapshot.password == pass)
                {
                    //main code goes here

                    switch (qid) {
                        case '102': {
                            if(req.method == 'POST')
                            {
                                //creating task
                                let uid = snapshot.id
                                let body = []
                                req.on('data', chunks => {
                                    body.push(chunks);
                                });
                                req.on('end', () => {
                                    let json = JSON.parse(Buffer.concat(body).toString());
                                    let meta = t1.post({
                                        title : json.title,
                                        description : json.description,
                                        duration : json.duration,
                                        userid : uid
                                    });

                                    //updating user activity
                                    User.update(snapshot.id, json.duration);

                                    sendJSON(meta);
                                });
                            }
                            else
                            {
                                //unparsable request
                                denyReq();
                            }
                            break;
                        }
                        case '103' : {
                            if(req.method == 'DELETE')
                            {
                                let tid = new URLSearchParams(req.url).get('tid');
                                //updating (not deleting task)
                                t1.update(tid, 'state', 'deleted');


                                //updating user activity
                                let activity = -1*parseInt(new URLSearchParams(req.url).get('activity'));
                                User.update(snapshot.id, activity);

                                sendJSON(null)
                            }
                            else
                            {
                                //unparsable request
                                denyReq();
                            }
                            break;
                        }
                        case '104' : {
                            if(req.method == 'GET')
                            {
                                let tasks = t1.getall().filter(task => task.userid == snapshot.id && task.state != 'deleted' && task.status == 'pending');
                                sendJSON(tasks);
                            }
                            else
                            {
                                //unparsable request
                                denyReq();
                            }
                            break;
                        }
                        case '105' : {
                            if(req.method == 'POST')
                            {
                                let tid = new URLSearchParams(req.url).get('tid');
                                //changine status to completed
                                t1.update(tid, 'status', 'completed');
                                console.log('task completed');

                                //changine activity
                                let activity = -1*parseInt(new URLSearchParams(req.url).get('activity'))
                                User.update(snapshot.id, activity);

                                sendJSON(null);
                            }
                            else
                            {
                                //unparsable request
                                denyReq();
                            }
                            break;
                        }
                        case '106' : {
                            if(req.method == 'POST')
                            {
                                let tid = new URLSearchParams(req.url).get('tid');
                                //updating hops and userid
                                task = t1.get(tid)[0];
                                t1.update(tid, 'hops', task.hops + 1);



                                //finding the user with lowest activity
                                let searchList = User.getall().filter(user => user.id != snapshot.id);
                                let param = {
                                    activity : searchList[0].activity,
                                    id : searchList[0].id
                                };
                                searchList.forEach(user => {
                                    if(user.activity < param.activity)
                                    {
                                        param.activity = user.activity;
                                        param.id = user.id;
                                    }
                                });


                                t1.update(tid, 'userid', param.id);
                                t1.update(tid, 'timestamp', new Date().getTime());

                                //changine activity
                                User.update(snapshot.id, -1*task.duration);

                                console.log('updated tasks');

                                sendJSON(null);
                            }
                            else
                            {
                                //unparsable request
                                denyReq();
                            }
                            break;
                        }
                    }

                    //------------------
                }
                else
                {
                    //auth failed
                    denyReq();
                }
            }
        }
        else
        {
            //signing user in
            //checking is username exists
            let snapshot = User.getName(uname);
            if(Object.keys(snapshot).length == 0)
            {
                let usr = User.post({
                    uname : uname,
                    password : pass
                });
                sendJSON(usr);
            }
            else
            {
                //user exists
                //check if password is correct
                if(snapshot.password == pass)
                {
                    sendJSON(User.getName(uname));
                }
                else
                {
                    denyReq();
                }
            }

        }
    }
    else
    {
        denyReq();
        //unparsable query
    }
}

const server = http.createServer(requestHandler).listen(5000);
