let router = require('express').Router();

let Story = require('../models/Story');

router.post('/:id/act', (req, res, next) => {
    const action = req.body.action;
    const counter = action === 'Like' ? 1 : -1;
    Story.findOneAndUpdate({_id: req.params.id}, {$inc: {likes_count: counter}}, {
        new: true,
        runValidators: true,
      }, (err, numberAffected) => {
        let Pusher = require('pusher');

        let pusher = new Pusher({
            appId: process.env.PUSHER_APP_ID,
            key: process.env.PUSHER_APP_KEY,
            secret: process.env.PUSHER_APP_SECRET,
            cluster: process.env.PUSHER_APP_CLUSTER
        });

        let payload = { action: action, postId: req.params.id };
        pusher.trigger('tutorial', 'postAction', payload, req.body.socketId);
        res.send('');
    });
});


module.exports = router;