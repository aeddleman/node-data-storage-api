var express = require('express');
var router = express.Router();

/*
    Setup for NODE CACHE
*/

const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 60 });

/*
    GET
*/

router.get('/data/cats/:id?', async (req, res) => {
    const key = getKeyFromReq(req);

    try {
        const getKeyFromCache = cache.get(key);

        // If no key was found
        if (!getKeyFromCache) {
            res.sendStatus(404);
        }

        // If key was found
        if (getKeyFromCache) {
            res.status(200).send({ name: getKeyFromCache.oid });
        }
        return;
    } catch (e) {
        res.sendStatus(500).send(e.message);
    }
});

/*
    PUT
*/

router.put('/data/cats', async (req, res) => {
    try {
        const data = req.body;
        const getKeyFromCache = cache.get(data.name);

        // If no key, create key
        if (!getKeyFromCache) {
            const value = {
                oid: data.name,
                size: 1234
            }
            const newKey = cache.set(data.name, value);

            // If create was successful
            if (newKey) {
                const getKeyFromCache = cache.get(data.name);
                res.status(201).send(getKeyFromCache);
            }
        }

        // If key already exists
        res.status(200).send(getKeyFromCache);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

/*
    DELETE
*/

router.delete('/data/cats/:id?', async (req, res) => {
    const key = getKeyFromReq(req);

    const getKeyFromCache = cache.get(key);

    // If key found
    if (getKeyFromCache) {
        try {
            const deleteKey = cache.del(getKeyFromCache.oid);
            if (deleteKey) {
                res.sendStatus(200);
            }
        } catch (e) {
            res.sendStatus(500).send(e.message);
        }
    } else if (!getKeyFromCache) {

        // Key not found
        res.sendStatus(404)
    }
});

/*
    Helper Methods
*/

function getKeyFromReq(req) {
    // Check if key was sent in params or body 
    let key;
    if (req.params.id) {
        key = req.params.id;
    } else if (req.body.name) {
        key = req.body.name;
    }
    return key;
}

/*
    Convenience Methods
*/

// router.get('/cache/list', verifyCache, async (req, res) => {
//     return cache.keys();
// });

// router.get('/cache/flush', verifyCache, async (req, res) => {
//     return cache.flushAll();
// });

module.exports = router;
