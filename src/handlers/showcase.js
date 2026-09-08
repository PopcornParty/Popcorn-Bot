const { base, THEME } = require('../utils/embeds');
function showcaseEmbeds() {
  return [
    base('What this bot does', THEME.pink).setDescription('Staff tools for giveaways, builder payments, build orders, roles, and spawner prices.'),
    base('Who can use what', THEME.info).setDescription('**Everyone**\n`/help` `/showcase` `/price lookup` `/price list`\nJoin giveaways with the Join button.\n\n**Staff**\nGiveaways, payments, builds, and giveaway validate.\n\n**Admin / Moderator**\nEverything staff can do, plus `/dev` and config.\n\n**Dev**\nHighest access. Can use every command.'),
    base('Giveaways', THEME.gold).setDescription('1. Staff run `/giveaway create` with prize, time (`10m`, `2h`, `1d`), winners, and host.\n2. Members press Join.\n3. Winners get an ID like `GW-XXXX`.\n4. Winner opens a ticket and gives that ID.\n5. Staff run `/giveaway validate`. It shows winner, host, how long ago, and paid or not.\n6. Host pays the winner. Staff press **Mark Giveaway Paid**.\n7. Optional: `/payment create` type Giveaway, amount like `50m`. No tax. Then mark it completed.'),
    base('Builds and payments', THEME.gold).setDescription('`/build create` makes the build and a taxed payment together.\nCustomer pays the full price. Tax is taken. Builder gets the rest.\nCustomer can approve the build or ask for changes.\n`/payment complete` or the completed button marks a payment paid.\nGiveaway payments have no tax.'),
    base('Money', THEME.info).setDescription('Type `50m`, `5.5m`, `200k`, or `1.2b`. The bot shows money the same way.'),
    base('Spawner prices', THEME.gold).setDescription('`/price lookup` and `/price list` show buy and sell prices for spawners. These are public messages. Staff can update them.'),
    base('Setup', THEME.pink).setDescription('`/dev admin` set Admin or Moderator\n`/dev staff` set Staff\n`/dev member` set Member (not @everyone)\n`/dev role` create a role or give a role to someone\nThe bot role must sit above the roles it assigns, and needs Manage Roles.')
  ];
}
module.exports = { showcaseEmbeds };
