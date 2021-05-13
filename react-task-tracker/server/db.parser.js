const { timeStamp, time } = require('console');
const fs = require('fs');
const uuid = require('uuid');

//blueprints for db
const User =  {
    get : (id) => {
        return JSON.parse(fs.readFileSync('./db/users.json', 'utf-8')).filter(user => user.id == id);
    },
    post : (data, perms='user') => {
        let id = uuid.v4()
        let timestamp = new Date().getTime();
        let writable = {
            id : id,
            perms : perms,
            uname : data.uname,
            password : data.password,
            timestamp : timestamp,
            activity : 0
        };
        let snapshot = JSON.parse(fs.readFileSync('./db/users.json', 'utf-8'));
        snapshot.push(writable);
        fs.writeFileSync('./db/users.json', JSON.stringify(snapshot));
        return {
            id : id,
            timestamp : timestamp
        };
    },
    delete : (id) => {
        let writable = JSON.parse(fs.readFileSync('./db/users.json', 'utf-8')).filter(user => user.id != id);
        fs.writeFileSync('./db/users.json', JSON.stringify(writable));
    },
    getall : () =>
    {
        return JSON.parse(fs.readFileSync('./db/users.json', 'utf-8'));
    },
    getName : (uname) => {
        let snapshot = JSON.parse(fs.readFileSync('./db/users.json', 'utf-8')).filter(user => user.uname == uname);
        return snapshot.length == 0? {} : snapshot[0];
    },
    update : (id, activity) => {
        let snapshot = User.getall();
        snapshot.forEach(user => {
            if(user.id == id)
            {
                user.activity += activity;
            }
        });
        fs.writeFileSync('./db/users.json', JSON.stringify(snapshot));
    },
    freeUserSort : (asc=true) => {
        let snapshot = JSON.parse(fs.readFileSync('./db/sub-collections/free.users.json', 'utf-8'));
        snapshot.sort((a, b) => {
            if(asc)
            {
                a.activity - b.activity;
            }
            else
            {
                b.activity - a.activity;
            }
        });
        fs.writeFileSync('./db/sub-collections/free.users.json', JSON.stringify(snapshot));
    },
    freeUserAppend : (user, asc=true) => {
        let snapshot = JSON.parse(fs.readFileSync('./db/sub-collections/free.users.json', 'utf-8'));
        snapshot.push(user);
        snapshot.sort((a, b) => {
            if(asc)
            {
                a.activity - b.activity;
            }
            else
            {
                b.activity - a.activity;
            }
        });
        fs.writeFileSync('./db/sub-collections/free.users.json', JSON.stringify(snapshot));
    },
    freeUserGetAll : () => {
        return JSON.parse(fs.readFileSync('./db/sub-collections/free.users.json', 'utf-8'));
    },
    freeUserUpdate : (id, activity, asc=true) => {
        let snapshot = User.freeUserGetAll()
        snapshot.forEach(user => {
            if(user.id == id)
            {
                user.activity += activity;
            }
        });
        snapshot.sort((a, b) => {
            if(asc)
            {
                a.activity - b.activity;
            }
            else
            {
                b.activity - a.activity;
            }
        });
        fs.writeFileSync('./db/sub-collections/free.users.json', JSON.stringify(snapshot));
    }
};

class Tasks {
    constructor(path='')
    {
        switch(path)
        {
            case '' : this.path = './db/tasks.json';
                    break;
            case 'hops' : this.path = './db/sub-collections/completed.hops.json';
                        break;
            case 'deleted' : this.path = './db/sub-collections/deleted.tasks.json';
                            break;
            case 'completed' : this.path = './db/sub-collections/completed.tasks.json';
                            break;
            default : break;
        }
    }
    changeOrigin(path='')
    {
        switch(path)
        {
            case '' : this.path = './db/tasks.json';
                    break;
            case 'hops' : this.path = './db/sub-collections/completed.hops.json';
                        break;
            case 'deleted' : this.path = './db/sub-collections/deleted.tasks.json';
                            break;
            case 'completed' : this.path = './db/sub-collections/completed.tasks.json';
                            break;
            default : break;
        }
    }
    get(id)
    {
        return JSON.parse(fs.readFileSync(this.path, 'utf-8')).filter(task => task.id == id);
    }
    post(data)
    {
        let id = uuid.v4()
        let timestamp = new Date().getTime();
        let writable = {
            id : id,
            title : data.title,
            description : data.description,
            timestamp : timestamp,
            duration : data.duration,
            userid : data.userid,
            hops : 0,
            status : 'pending',
            state : 'active'
        };
        let snapshot = JSON.parse(fs.readFileSync(this.path, 'utf-8'));
        snapshot.push(writable);
        fs.writeFileSync(this.path, JSON.stringify(snapshot));
        return {
            id : id,
            timestamp : timestamp,
            userid : data.userid
        };
    }
    delete(id) 
    {
        let writable = JSON.parse(fs.readFileSync(this.path, 'utf-8')).filter(task => task.id != id);
        fs.writeFileSync(this.path, JSON.stringify(writable));
    }
    getall()
    {
        return JSON.parse(fs.readFileSync(this.path, 'utf-8'));
    }
    update(id, key, val)
    {
        let snapshot = this.getall();
        snapshot.forEach(task => {
            if(task.id == id)
            {
                task[key] = val;
            }
        });
        fs.writeFileSync(this.path, JSON.stringify(snapshot));
    }
}

module.exports = {Tasks, User}