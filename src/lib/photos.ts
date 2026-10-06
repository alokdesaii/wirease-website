// ponytail: Unsplash placeholders. Replace with Wirease photography before launch.
const u = (id: string, w = 2000) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const PHOTOS = {
  hero: u("1758274252219-5f20097548c9", 2400),
  quote: u("1595986630530-969786b19b4d", 1400),
  pay: u("1580519542036-c47de6196ba5", 1400),
  screen: u("1531539427495-97c44a449837", 1400),
  deliver: u("1744282887685-22f0d360a346", 1400),
};
