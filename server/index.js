const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const mongoose = require("mongoose");
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({ dest: './uploads/' });
const fs = require('fs');

const functions = require('./functions.js');

const salt = bcrypt.genSaltSync(10);
const secret = 'sdfklknwaeivow2i4ofmwp30';


//middleware
app.use(express.json());
app.use(cors({ credentials: true, origin: "https://sito-pane-app.vercel.app" }));   // per la produzione
// app.use(cors({ credentials: true, origin: "http://localhost:3000" }));  // per il locale
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

//DB connection
mongoose.connect('mongodb+srv://mattyk0207:DChcpihwwYP1HVAm@cluster0.gwi3na7.mongodb.net/');


// utenti
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const userDoc = await User.create({
            username,
            password: bcrypt.hashSync(password, salt),
            admin: "false",
            notifications: [functions.welcomeMessage(username)],
            stats: functions.createStats()
        });
        res.json(userDoc);
    } catch (e) {
        res.status(400).json(e);
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const userDoc = await User.findOne({ username });
    if (userDoc != null) {
        const passOk = bcrypt.compareSync(password, userDoc.password);
        if (passOk) {
            // logged in
            jwt.sign({ username, id: userDoc._id, admin: userDoc.admin }, secret, {}, (err, token) => {
                if (err) { res.status(403).send(err); return; }
                res.cookie('token', token).json({   //res.setHeader('Set-Cookie',[`token=${token}`])
                    info: {
                        id: userDoc._id,
                        username,
                        admin: userDoc.admin,
                    },
                    jwt: token
                });
            });
        } else {
            res.status(400).json('wrong credentials');
        }
    }else {
        res.status(400).json('wrong credentials');
    }
});

app.get('/:token/profile', (req, res) => {
    // const { token } = req.cookies;
    const { token } = req.params;
    jwt.verify(token, secret, {}, (err, info) => {
        if (err) res.status(403).json(err); // console.log(err);   //throw err;
        else res.json(info);
    });
});

app.post('/:token/logout', (req, res) => {
    // const { token } = req.cookies;
    const { token } = req.params;
    jwt.verify(token, secret, {}, (err, info) => {
        if (err) res.status(403).json(err); // console.log(err);   //throw err;
        else res.cookie('token', '').json('ok');
    });
});

// statistiche
app.get('/:token/user/stats', async (req, res) => {
    // const { token } = req.cookies;
    const { token } = req.params;
    let username;

    jwt.verify(token, secret, {}, (err, info) => {
        if (err) { res.status(403).send(err); return; }
        username = info.username;
    });
    const stats = await User.findOne({ username }, { stats: true, _id: false });
    if (stats)
        res.json(stats.stats);
    else
        res.status(404).send();
})

// prodotti
app.post('/:token/product', uploadMiddleware.single('file'), async (req, res) => {
    if (req.file) {
        const { originalname, path } = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        const newPath = path + '.' + ext;
        fs.renameSync(path, newPath);

        // const { token } = req.cookies;
        const { token } = req.params;
        jwt.verify(token, secret, {}, async (err, info) => {
            if (err) { res.status(403).send(err); return; }
            const { name, desc, price, hidden } = req.body;
            try {
                const productDoc = await Product.create({
                    name,
                    desc,
                    price,
                    imgSrc: newPath,
                    hidden,
                });
                res.json(productDoc);
            } catch (e) {
                res.status(500).json(e);
            }
        });
    }
    else {
        // const { token } = req.cookies;
        const { token } = req.params;
        jwt.verify(token, secret, {}, async (err, info) => {
            if (err) { res.status(403).send(err); return; }
            const { name, desc, price, url, hidden } = req.body;
            try {
                const productDoc = await Product.create({
                    name,
                    desc,
                    price,
                    imgUrl: url,
                    hidden,
                });
                res.json(productDoc);
            } catch (e) {
                res.status(500).json(e);
            }
        });
    }
});

app.put('/:token/product', uploadMiddleware.single('file'), async (req, res) => {
    let newPath = null;
    if (req.file) {
        const { originalname, path } = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        newPath = path + '.' + ext;
        fs.renameSync(path, newPath);

        // const { token } = req.cookies;
        const { token } = req.params;
        jwt.verify(token, secret, {}, async (err, info) => {
            if (err) { res.status(403).send(err); return; }

            const { name, desc, price, hidden } = req.body;
            const productDoc = await Product.findOne({ name: name });
            if (productDoc) {
                await Product.updateOne({ name: name }, {
                    desc: desc ? desc : productDoc.desc,
                    price: price ? price : productDoc.price,
                    imgSrc: newPath ? newPath : productDoc.imgSrc,
                    hidden: productDoc.hidden,  //hidden ? hidden :  per ora la visibilità non è settabile
                });
                res.json(productDoc);
            }
            else
                res.status(400).json(`${name} non è un prodotto esistente`);
        });
    }
    else {
        // const { token } = req.cookies;
        const { token } = req.params;
        jwt.verify(token, secret, {}, async (err, info) => {
            if (err) { res.status(403).send(err); return; }
    
            const { name, desc, price, url, hidden } = req.body;
            const productDoc = await Product.findOne({ name: name });
            if (productDoc) {
                await Product.updateOne({ name: name }, {
                    desc: desc ? desc : productDoc.desc,
                    price: price ? price : productDoc.price,
                    imgUrl: url ? url : productDoc.url,
                    hidden: productDoc.hidden,  //hidden ? hidden :  per ora la visibilità non è settabile
                });
                res.json(productDoc);
            }
            else
                res.status(400).json(`${name} non è un prodotto esistente`);
        });

    }

});

app.get('/product', async (req, res) => {
    const products = await Product.find({ hidden: false });
    res.json(products);
});

app.get('/product/:name', async (req, res) => {
    const { name } = req.params;
    const productDoc = await Product.findOne({ name });
    res.json(productDoc);
});

app.delete('/:token/product/:name', async (req, res) => {
    const { token, name } = req.params;
    //verifica dell'identità
    jwt.verify(token, secret, {}, (err, info) => {
        if (err) {
            res.status(403).json(err);
            return;
        }
        if (!info.admin)
            res.status(403).json("l'utente non è un amminisratore");
        username = info.username;
    });

    const product = await Product.findOne({ name });
    try {
        fs.unlinkSync(product?.imgSrc);
    }
    catch (e) {
        console.log(e);
    }

    const productDoc = await Product.deleteOne({ name });
    if (productDoc)
        res.json(productDoc);
    else res.status(500).send();
});

// ordini
app.post('/:token/order', async (req, res) => {
    //verifica dell'identità
    // const { token } = req.cookies;
    const { token } = req.params;
    let username = '';
    jwt.verify(token, secret, {}, (err, info) => {
        if (err) {
            res.status(403).json(err);
            return;
        }
        username = info.username;
    });

    const { productsNames, quantities, desc } = req.body;
    const date = new Date();
    let products = [];
    let prices = [];
    let q = [];
    let n = [];
    try {
        let Products = await Product.find();
        Products.forEach(p => {
            productsNames.forEach(pn => {
                if (p.name === pn) {
                    products.push(p);
                    prices.push(p.price);
                    q.push(quantities[productsNames.indexOf(pn)]);
                    n.push(productsNames[productsNames.indexOf(pn)]);
                }
                // console.log(p);
            })
        });
        const userDoc = await User.updateOne({ username }, { $inc: { 'stats.orders': 1 } });
        const oderDoc = await Order.create({
            username,
            products,
            productNames: n,
            quantities: q,
            prices,
            desc,
            date,
            mark: false,
        });
        res.json(oderDoc);
    } catch (e) {
        res.status(500).json(e);
    }
});

app.get('/:token/order', async (req, res) => {
    let a = false;
    // const { token } = req.cookies;
    const { token } = req.params;
    jwt.verify(token, secret, {}, (err, info) => {
        if (err) { res.status(403).send(err); return; }
        if (!info.admin) {
            res.status(403).json("l'utente non è un amminisratore");
        }
        else {
            a = true;
        }
    });
    if (a) {
        let orders = await Order.find();
        res.json(orders);
    }
})

app.get('/:token/non-marked-order', async (req, res) => {
    let a = false;
    // const { token } = req.cookies;
    const { token } = req.params;

    jwt.verify(token, secret, {}, (err, info) => {
        if (err) { res.status(403).send(err); return; }
        if (!info.admin) {
            res.status(403).json("l'utente non è un amminisratore");
        }
        else {
            a = true;
        }
    });
    if (a) {
        let orders = await Order.find({ mark: false });
        res.json(orders);
    }
})

app.get('/:token/marked-order', async (req, res) => {
    let a = false;
    // const { token } = req.cookies;
    const { token } = req.params;

    jwt.verify(token, secret, {}, (err, info) => {
        if (err) { res.status(403).send(err); return; }
        if (!info.admin) {
            res.status(403).json("l'utente non è un amminisratore");
        }
        else {
            a = true;
        }
    });
    if (a) {
        let orders = await Order.find({ mark: true });
        res.json(orders);
    }
})

app.delete('/:token/order/:id', async (req, res) => {
    // const { token } = req.cookies;
    const { token } = req.params;
    const { id } = req.params;

    jwt.verify(token, secret, {}, (err, info) => {
        if (err) { res.status(403).send(err); return; }
        if (!info.admin) {
            res.status(400).json("l'utente non è un amminisratore");
            return
        }
    });
    let orders = await Order.deleteOne({ _id: id });
    res.json(orders);
})

app.put('/:token/order/:id/mark', async (req, res) => {
    // const { token } = req.cookies;
    const { token } = req.params;
    const { id } = req.params;

    jwt.verify(token, secret, {}, (err, info) => {
        if (err) { res.status(403).send(err); return; }
        if (!info.admin) {
            res.status(400).json("l'utente non è un amminisratore");
            return
        }
    });
    try {
        let order = await Order.findOneAndUpdate({ _id: id }, { mark: true });
        const userDoc = await User.updateOne({ username: order?.username }, { $inc: { 'stats.completedOrders': 1 } });
        res.json(order);
    } catch (e) {
        res.status(500).json(e);
    }
})

app.get('/:token/user/order', async (req, res) => {
    // const { token } = req.cookies;
    const { token } = req.params;
    let username;

    jwt.verify(token, secret, {}, (err, info) => {
        if (err) { res.status(403).send(err); return; }
        username = info.username;
    });
    const orders = await Order.find({ username });
    res.json(orders);
})

// notifiche
app.post('/:token/notification', multer().fields([]), async (req, res) => {
    // const { token } = req.cookies;
    const { token } = req.params;
    const { title, content, dest } = req.body;
    const date = new Date();
    const id = Math.floor(Math.random() * 1000000000);

    jwt.verify(token, secret, {}, (err, info) => {
        if (err) { res.status(403).send(err); return; }
        if (!info.admin) {
            res.status(400).json("l'utente non è un amminisratore");
            return
        }
    });

    try {
        if (dest === 'all') {
            const userDoc = await User.updateMany({}, { $push: { notifications: { id, title, content, dest, date, read: false } } });
            if (userDoc) {
                res.json(userDoc);
            }
            else {
                res.status(404).send()
            }
        }
        else if (dest === 'clients') {
            const userDoc = await User.updateMany({ admin: false }, { $push: { notifications: { id, title, content, dest, date, read: false } } });
            if (userDoc) {
                res.json(userDoc);
            }
            else {
                res.status(404).send()
            }
        }
        else {
            const userDoc = await User.updateOne({ username: dest }, { $push: { notifications: { id, title, content, dest, date, read: false } } });
            if (userDoc) {
                res.json(userDoc);
            }
            else {
                res.status(404).send()
            }
        }
    } catch (e) {
        res.status(500).json(e);
    }
})

app.put('/:token/:id/notification', async (req, res) => {
    // const { token } = req.cookies;
    const { token, id } = req.params;
    let name;

    jwt.verify(token, secret, {}, (err, info) => {
        if (err) { res.status(403).send(err); return; }
        name = info.username;
    });
    try {
        let userDoc = await User.findOneAndUpdate(
            { username: name },
            { $pull: { 'notifications': { 'id': id } } }
        );
        let notifications = userDoc.notifications;
        for (let i = 0; i < notifications.length; i++) {
            if (notifications[i].id == id) {
                notifications[i].read = true;
            }
        }
        userDoc = await User.updateOne(
            { username: name },
            { $set: { 'notifications': notifications } }
        );
        res.json(userDoc);
    } catch (e) {
        console.log(e);
        res.status(500).json(e);
    }
})

app.get('/:token/notification', async (req, res) => {
    // const { token } = req.cookies;
    const { token } = req.params;
    let name;

    jwt.verify(token, secret, {}, (err, info) => {
        if (err) { res.status(403).send(err); return; }
        name = info.username;
    });
    let user = await User.findOne({ username: name });
    if (user) {
        res.json(user.notifications);
    }
    else
        res.status(404).send();
})

app.get('/:token/notification/new', async (req, res) => {
    // const { token } = req.cookies;
    const { token } = req.params;
    let name;

    jwt.verify(token, secret, {}, (err, info) => {
        if (err) { res.status(403).send(err); return; }
        name = info.username;
    });
    let user = await User.findOne({ username: name });
    if (user) {
        if (user.notifications)
            res.json(user.notifications.filter(n => n.read === false));
        else
            res.json([]);
    }
    else
        res.status(404).send();
})

app.delete('/:token/notification/:title', async (req, res) => {
    // const { token } = req.cookies;
    const { token } = req.params;
    const { title } = req.params;

    jwt.verify(token, secret, {}, (err, info) => {
        if (err) { res.status(403).send(err); return; }
        if (!info.admin) {
            res.status(400).json("l'utente non è un amminisratore");
            return
        }
    });
    try {
        let users = await User.updateMany({}, { '$pull': { 'notifications': { 'title': title } } });
        res.json(users);
    } catch (e) {
        res.status(500).json(e);
    }
})

app.listen(4000, () => { console.log("listening on http://localhost:4000") });

module.exports = app;
