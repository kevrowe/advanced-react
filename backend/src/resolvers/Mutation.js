const mutations = {
  async createItem(parent, args, context, info) {
    // TODO: Check if they are logged in
    const item = await context.db.mutation.createItem(
      { data: { ...args } },
      info
    );

    return item;
  },
  async deleteItem(parent, args, context, info) {
    const where = { id: args.id };
    const item = context.db.query.items({ where }, `{id title}`);
    // TODO: Check if we own it
    return context.db.mutation.deleteItem({ where }, info);
  }
};

module.exports = mutations;
