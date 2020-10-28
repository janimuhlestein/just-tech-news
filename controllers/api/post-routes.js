const router = require('express').Router();
const {Post, User, Vote, Comment} = require('../../models');
const sequelize = require('../../config/connection');
const withAuth = require('../../utils/auth');
const { route } = require('./user-routes');

//get all users
router.get('/', (req, res)=>{
    console.log('============================');
    Post.findAll({
        //query configuration
        attributes: ['id', 'post_url', 'title', 'created_at',[sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']],
        order: [['created_at', 'DESC']],
        include: [
        {
            model: Comment,
            attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        },
        {

            model: User,
            attributes: ['username']
        }
    ]
    })
    .then(dbPostData=>{
        res.json(dbPostData);
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/:id', (req, res)=>{
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['id', 'post_url', 'title', 'created_at',[sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']],
        include: [{
            model: User,
            attributes: ['username']
        }]
    })
    .then(dbPostData=>{
        if(!dbPostData){
            res.status(404).json({message: 'No post found with this id'});
            return;
        }
        res.json(dbPostData);
    });
});

router.post('/', withAuth, (req, res)=>{
    //expects title, post_url, user_id
    Post.create({
        title: req.body.title,
        post_url: req.body.post_url,
        user_id: req.session.user_id
    })
    .then(dbPostData=>{
        res.json(dbPostData);
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json(err);
    });
});

//PUT /api/posts/upvote
router.put('/upvote', (req, res) => {
    //make sure session exists
    if(req.session) {
        //pass session id along with the information
        Post.upvote({...req.body, user_id: req.session.user_id}, {Vote, Comment, User})
        .then(updatedVoteData=> {
            console.log(updatedVoteData);
            res.json(updatedVoteData);
        });
    }
  });

router.put('/:id', withAuth, (req,res)=>{
    Post.update(
    {
        title: req.body.title
    },
    {
        where: {
            id: req.params.id
        }
    }
    )
    .then(dbPostData=>{
        if(!dbPostData){
            res.status(404).json({message: 'No post found with this id'});
            return;
        }
        res.json(dbPostData);
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json(err);
    });
});

router.delete('/:id', withAuth, (req,res)=> {
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbPostData=>{
        if(!dbPostData) {
            res.status(404).json({message: 'No post found with this id'});
            return;
        }
        res.json(dbPostData);
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;