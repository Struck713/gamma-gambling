export const ValidateProps = {
    user: {
      username: { type: 'string', minLength: 4, maxLength: 20 },
      name: { type: 'string', minLength: 1, maxLength: 50 },
      password: { type: 'string', minLength: 8 },
      email: { type: 'string', minLength: 1 },
      bio: { type: 'string', minLength: 0, maxLength: 160 },
    },
    post: {
      content: { type: 'string', minLength: 1, maxLength: 280 },
    },
    comment: {
      content: { type: 'string', minLength: 1, maxLength: 280 },
    },
};

export const ncOpts = {
  onError(err: any, req: any, res: any) {
    console.error(err);
    res.statusCode =
      err.status && err.status >= 100 && err.status < 600 ? err.status : 500;
    res.json({ message: err.message });
  },
};