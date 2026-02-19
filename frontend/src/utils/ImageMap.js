

const CUISINE_SEEDS = {
  'southern':    ['BBQ','peach','cornbread','fried-chicken','pie'],
  'italian':     ['pasta','pizza','risotto','bruschetta','tiramisu'],
  'mexican':     ['tacos','burrito','guacamole','enchilada','salsa'],
  'asian':       ['sushi','ramen','stir-fry','dumpling','noodle'],
  'chinese':     ['noodle','dumpling','stir-fry','rice','soup'],
  'japanese':    ['sushi','ramen','tempura','miso','bento'],
  'indian':      ['curry','naan','spice','masala','rice'],
  'french':      ['croissant','crepe','baguette','quiche','pastry'],
  'mediterranean':['olive','hummus','falafel','lamb','salad'],
  'greek':       ['lamb','olive','feta','gyro','salad'],
  'thai':        ['pad-thai','curry','coconut','lemongrass','basil'],
  'american':    ['burger','bbq','steak','fries','sandwich'],
  'breakfast':   ['pancake','eggs','bacon','waffle','coffee'],
  'dessert':     ['cake','chocolate','cookies','ice-cream','pastry'],
  'seafood':     ['salmon','shrimp','lobster','fish','crab'],
  'vegetarian':  ['salad','vegetables','tofu','grain','soup'],
  'soup':        ['soup','broth','stew','bisque','chowder'],
  'bbq':         ['BBQ','grill','smoke','ribs','brisket'],
  'default':     ['food','cooking','kitchen','meal','dish'],
}

const FOOD_PHOTO_IDS = [
  'photo-1546069901-ba9599a7e63c',
  'photo-1565299624946-b28f40a0ae38',
  'photo-1567620905732-2d1ec7ab7445',
  'photo-1540189549336-e6e99c3679fe',
  'photo-1504674900247-0877df9cc836',
  'photo-1512621776951-a57141f2eefd',
  'photo-1476224203421-9ac39bcb3327',
  'photo-1490645935967-10de6ba17061',
  'photo-1482049016688-2d3e1b311543',
  'photo-1498837167922-ddd27525d352',
  'photo-1533089860892-a7c6f0a88666',
  'photo-1467003909585-2f8a72700288',
  'photo-1544025162-d76694265947',
  'photo-1555939594-58d7cb561ad1',
  'photo-1519984388953-d2406bc725e1',
  'photo-1551183053-bf91798d9bcf',
  'photo-1563729784474-d77dbb933a9e',
  'photo-1574484284002-952d92456975',
  'photo-1571167290370-e4e4e3a5c7d8',
  'photo-1585032226651-759b368d7246',
]

function hashString(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

export function getRecipeImageUrl(title = '', cuisine = '', width = 400, height = 300) {
  const hash = hashString((title + cuisine).toLowerCase())
  const photoId = FOOD_PHOTO_IDS[hash % FOOD_PHOTO_IDS.length]
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${width}&h=${height}&q=80`
}

export function getCuisineGradient(cuisine = '') {
  const c = cuisine.toLowerCase()
  if (c.includes('southern') || c.includes('bbq'))   return 'linear-gradient(135deg,#8B3A1A,#C1593A)'
  if (c.includes('italian'))                          return 'linear-gradient(135deg,#2d6a2d,#5a9e3a)'
  if (c.includes('mexican'))                          return 'linear-gradient(135deg,#7a2d0a,#e8a030)'
  if (c.includes('asian') || c.includes('chinese'))  return 'linear-gradient(135deg,#8B1A1A,#C41E3A)'
  if (c.includes('japanese'))                         return 'linear-gradient(135deg,#1a1a4e,#4e4e8B)'
  if (c.includes('indian'))                           return 'linear-gradient(135deg,#7a4a0a,#e07820)'
  if (c.includes('french'))                           return 'linear-gradient(135deg,#1a2e6b,#4a7ab5)'
  if (c.includes('mediterranean') || c.includes('greek')) return 'linear-gradient(135deg,#0a4a6b,#2a8ab5)'
  if (c.includes('thai'))                             return 'linear-gradient(135deg,#4a2a6b,#8a5ab5)'
  if (c.includes('breakfast'))                        return 'linear-gradient(135deg,#6b4a1a,#c8922a)'
  if (c.includes('dessert') || c.includes('baking')) return 'linear-gradient(135deg,#6b1a4a,#b5508a)'
  if (c.includes('seafood'))                          return 'linear-gradient(135deg,#0a4a5a,#2a8a9a)'
  return 'linear-gradient(135deg,#3d2e1e,#6b5240)'
}