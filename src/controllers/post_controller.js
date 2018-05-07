import Post from '../models/post_model';

export const createPost = (req, res) => {
  const post = new Post();
  post.title = req.body.title;
  post.tags = req.body.tags;
  post.content = req.body.content;
  post.cover_url = req.body.cover_url;
  post.save()
    .then((result) => {
      res.json({ message: 'Post created!', post });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

export const getPosts = (req, res) => {
  Post.find({})
    .then((result) => {
      // remove content for each post, don't want to include here
      for (let i = 0; i < result.length; i++) {
        delete (result[i].content);
      }
      res.send(result);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

export const getPost = (req, res) => {
  Post.findById(req.params.id)
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

export const deletePost = (req, res) => {
  Post.remove({ _id: req.params.id })
    .then((result) => {
      res.json({ message: 'Delete successful' });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

export const updatePost = (req, res) => {
  Post.findById(req.params.id)
    .then((result) => {
      const post = result;
      // adapted from https://stackoverflow.com/questions/286141/remove-blank-attributes-from-an-object-in-javascript
      Object.keys(req.body).forEach((key) => { return (req.body[key] === '') && delete req.body[key]; });
      Object.assign(post, req.body);
      post.save()
        .then((saveResult) => {
          res.send(post);
        })
        .catch((error) => {
          res.status(500).json({ error });
        });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};
