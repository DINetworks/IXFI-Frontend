import { ChainType } from '@0xsquid/squid-types'

export function getSocialIntentUrl(platform, postContent) {
  const postContentEncoded = encodeURIComponent(postContent)
  switch (platform) {
    case 'x.com':
      return `https://x.com/intent/tweet?text=${postContentEncoded}`
    case 'farcaster':
      return `https://warpcast.com/~/compose?text=${postContentEncoded}`
    case 'telegram':
      return `https://t.me/share/url?url=app.squidrouter.com&text=${postContentEncoded}`
    default:
      return ''
  }
}

export const getRandomSocialPost = ({ fromToken, toToken, fromChain, toChain }) => {
  const prefix = `I just swapped with @squidrouter 💜🤝`

  const postOptions = [
    {
      text: `Tokens flow like a river,
Squid connects them all,
${fromToken?.symbol} to ${toToken?.symbol},
Interoperability's call.`,
      condition: toChain?.chainType !== ChainType.COSMOS,
      generic: true
    },
    {
      text: `Across chains they travel,
With Squid's help they unite,
${fromToken?.symbol} to ${toToken?.symbol},
A beautiful sight.`,
      condition: toChain?.chainType !== ChainType.COSMOS,
      generic: true
    },
    {
      text: `The beauty of cross-chain,
Squid makes it a breeze,
${fromToken?.symbol} to ${toToken?.symbol},
Token swaps with ease.`,
      condition: toChain?.chainType !== ChainType.COSMOS,
      generic: true
    },
    {
      text: `With Squid as our guide,
Tokens move with grace,
${fromToken?.symbol} to ${toToken?.symbol},
A seamless exchange takes place.`,
      condition: toChain?.chainType !== ChainType.COSMOS,
      generic: true
    },
    // ...existing poetry options, refactored to use ?. and direct property access...
    {
      text: `Like a snowflake in a blizzard,
My tokens reach their place,
To Avalanche network they go,
Swapping at a great pace.`,
      condition: toChain?.networkName?.toLowerCase().includes('avalanche') || false
    },
    {
      text: `To Avalanche, my tokens flow.
Moving at speed like a cascade of snow,
Squid leads the way, through the blizzard they cruise,
In a seamless swap, where they'll find a new use.`,
      condition: toChain?.networkName?.toLowerCase().includes('avalanche') || false
    },
    {
      text: `Tokens rush down, like a winter's storm,
To Avalanche's peak, where they are transformed.
Squid provides the path, with guidance so true,
In a seamless swap, tokens shine anew.`,
      condition: toChain?.networkName?.toLowerCase().includes('avalanche') || false
    },
    {
      text: `Tokens swirl like snowflakes, in a winter's play,
To Avalanche's realm, where they come to stay.
In a seamless swap, without delay.
Squid is the guide, who shows them the way.`,
      condition: toChain?.networkName?.toLowerCase().includes('avalanche') || false
    },
    {
      text: `Tokens rush down, like a winter's storm,
To Avalanche's peak, where they are transformed.
Squid provides the path, with guidance so true,
Through the swirling snow, to a world brand new.`,
      condition: toChain?.networkName?.toLowerCase().includes('avalanche') || false
    },
    {
      text: `Tokens fly fast, like comets through the space,
To Moonbeam's station, where they find their place.
Squid the link, connecting stars and moons,
Enabling seamless swaps, like a beautiful tune.`,
      condition: toChain?.networkName?.toLowerCase().includes('moonbeam') || false
    },
    {
      text: `Tokens journey, like explorers in a quest,
To Moonbeam's galaxy, where they find the best.
Squid the guide, leading through the vast expanse,
Bringing tokens to their next cosmic dance.`,
      condition: toChain?.networkName?.toLowerCase().includes('moonbeam') || false
    },
    {
      text: `Tokens fly, like UFO's in the air,
To a new realm, where liquidity is shared,
Squid the messenger, transmitting tokens with care,
Over to Moonbeam, Squid takes them there.`,
      condition: toChain?.networkName?.toLowerCase().includes('moonbeam') || false
    },
    {
      text: `Tokens journey, to Polygon they go,
Where scalability makes their path aglow,
From one chain to another, with ease they'll roam,
Through Squid's guidance, they'll find their new home.`,
      condition: toChain?.networkName?.toLowerCase().includes('polygon') || false
    },
    {
      text: `Tokens take a leap, to lands unknown,
With Squid as guide, they're never alone.
To Celo they go, a mission in sight,
To invest in good, and bring change to light.`,
      condition: toChain?.networkName?.toLowerCase().includes('celo') || false
    },
    {
      text: `Tokens on a quest, to make a change,
With Squid as their guide, their path is arranged.
To Celo they flock, to do what's right,
For projects that heal, and make the world bright.`,
      condition: toChain?.networkName?.toLowerCase().includes('celo') || false
    },
    {
      text: `A cosmic symphony of liquidity,
Squid conducts with seamless capability.
${fromToken?.symbol} to ${toToken?.symbol}, the melody plays,
Cross-chain harmony in cosmic ways.`,
      condition: toChain?.chainType === ChainType.COSMOS
    },
    {
      text: `In Akash's cosmic web, a sight to behold,
Tokens surf the stars, in stories yet untold.
From distant galaxies to Akash's serene domain, Swapping freely, limitless possibilities attain`,
      condition: toChain?.networkName?.toLowerCase().includes('akash') || false
    },
    {
      text: `A cosmic symphony of liquidity,
Squid conducts with seamless capability.
${fromToken?.symbol} to ${toToken?.symbol}, the melody plays,
  Cross-chain harmony in cosmic ways.`,
      condition: toChain?.chainType === ChainType.COSMOS
    },
    {
      text: `Tokens traverse space, the chasm is erased,
Swapped with just one click,
Squid makes the cosmos tick.`,
      condition: toChain?.chainType === ChainType.COSMOS
    },
    {
      text: `Swapped with just one click, Squid's widget is the trick,
My assets now roam free
Across the galaxy.`,
      condition: toChain?.chainType === ChainType.COSMOS
    },
    {
      text: `Tokens flow 'cross space dust,
Swapped with just one click,
The galaxy sings sweet
Through Squid's interstellar trick.`,
      condition: toChain?.chainType === ChainType.COSMOS
    },
    {
      text: `Tokens flow like comets,
Squid makes the cosmos shrink,
My assets change planets
Through Squid's interstellar link.`,
      condition: toChain?.chainType === ChainType.COSMOS
    },
    {
      text: `Squid's music in the cosmic choir,
Assets swap, rising higher,
Space is filled with their tune,
Under the radiant silver moon.`,
      condition: toChain?.chainType === ChainType.COSMOS
    },
    {
      text: `Tokens in the stardust shower,
Exchanging with newfound power,
Squid's boon lifts them high,
In the cosmos, they fly.`,
      condition: toChain?.chainType === ChainType.COSMOS
    },
    {
      text: `Swift as comets, tokens fly,
Cross-chains in the sky,
Squid's swap makes them glide,
In the cosmos far and wide.`,
      condition: toChain?.chainType === ChainType.COSMOS
    },
    {
      text: `To galaxies near and far,
Tokens, swapped beneath the star,
Squid's swaps are a delight,
In the cosmos, starlit night.`,
      condition: toChain?.chainType === ChainType.COSMOS
    },
    {
      text: `Swapping tokens in an endless dance,
A celebratory space romance,
Thanks to Squid, the cosmos swing,
As the stars align and sing.`,
      condition: toChain?.chainType === ChainType.COSMOS
    },
    {
      text: `Swapped with just one gleaming spark,
Tokens voyage through the dark,
Squid's swaps quick and silent,
In the universe shining, vibrant.`,
      condition: toChain?.chainType === ChainType.COSMOS
    },
    {
      text: `The Cosmos chain slowly unfurled,
Squid swaps in this celestial world,
Crossing chains with swift reward,
Throughout the cosmos to explore. `,
      condition: toChain?.chainType === ChainType.COSMOS
    },
    {
      text: `In the cosmic realm, Squid reigns supreme,
Tokens moving with ease, like a cosmic dream.
With its swaps as the cosmic key,
Tokens find freedom, for all to see.`,
      condition: toChain?.chainType === ChainType.COSMOS
    },
    {
      text: `Through cosmic paths, Squid leads the way,
Tokens flowing in the cosmic ballet.
${fromToken?.symbol} to ${toToken?.symbol}, a cosmic rhyme,
A brighter future for tokens, for all time.`,
      condition: toChain?.chainType === ChainType.COSMOS
    },
    {
      text: `In the cosmic river, tokens flow,
Squid Router, the cosmic undertow.
A gateway to the cosmos' grand design,
Unlocking access with its power divine.`,
      condition: toChain?.chainType === ChainType.COSMOS
    },
    {
      text: `Like celestial waves, tokens glide,
Squid Router as their cosmic guide.
${fromToken?.symbol} to ${toToken?.symbol}, a stellar pair,
Navigating the universe with cosmic flair.`,
      condition: toChain?.chainType === ChainType.COSMOS
    },
    {
      text: `Through cosmic depths and astral planes,
Squid's power reigns.
${fromToken?.symbol} to ${toToken?.symbol}, it commands,
Interoperability it expands.`,
      condition: toChain?.chainType === ChainType.COSMOS
    },
    {
      text: `Across the cosmic plane, tokens soar,
Squid Router opens cosmic doors.
${fromToken?.symbol} to ${toToken?.symbol}, a cosmic flight,
Interoperability shining bright.`,
      condition: toChain?.chainType === ChainType.COSMOS
    },
    {
      text: `In the tapestry of the universe, Squid reveals its might,
Tokens venture through celestial light.
${fromToken?.symbol} to ${toToken?.symbol}, universal exchange,
Empowering the cosmos, a celestial range.`,
      condition: toChain?.chainType === ChainType.COSMOS
    },
    {
      text: `In the realm where stars align,
Squid guides tokens in a cosmic design.
${fromToken?.symbol} to ${toToken?.symbol}, a stellar link,
Expanding universal horizons, bridging the brink.`,
      condition: toChain?.networkName?.toLowerCase().includes('stargaze') || false
    },
    {
      text: `Tokens intertwine in the stellar embrace,
Squid's cosmic portal, a celestial space.
${fromToken?.symbol} to ${toToken?.symbol}, a universal gate,
Connecting galaxies, where wonders await.`,
      condition: toChain?.chainType === ChainType.COSMOS
    },
    {
      text: `In Akash's cosmic web, a sight to behold,
Tokens surf the stars, in stories yet untold.
From distant galaxies to Akash's serene domain,
Swapping freely, limitless possibilities attain`,
      condition: toChain?.networkName?.toLowerCase().includes('akash') || false
    },
    {
      text: `A symphony of liquidity, Akash's grand stage,
Tokens dance through chains, in interchain engage.
From Akash's embrace, harmony takes flight,
Interchain melodies, a cosmic delight.`,
      condition: toChain?.networkName?.toLowerCase().includes('akash') || false
    },
    {
      text: `Osmosis, the alchemist of chains, Tokens transformed,
as Squid harmony reigns. Through Osmosis' portal, magic unfolds,
Cosmic melodies resound, as secrets are told.`,
      condition: toChain?.networkName?.toLowerCase().includes('osmosis') || false
    },
    {
      text: `In cosmic bounds, tokens glide,
Interchain leaps, Stride takes it in stride.
With cosmic finesse, tokens forge ahead,
In Stride's cosmic realm, no challenge to dread.`,
      condition: toChain?.networkName?.toLowerCase().includes('stride') || false
    },
    {
      text: `In interchain's symphony, Stride conducts the play,
Tokens traverse cosmic paths, harmonizing the way.
From ${fromToken?.symbol} to ${toToken?.symbol}, interchain's melody blends,
Cosmic harmonies, interchain's song transcends.`,
      condition: toChain?.networkName?.toLowerCase().includes('stride') || false
    },
    {
      text: `In interchain's symphony, Stride conducts the play,
Tokens traverse cosmic paths, harmonizing the way.
From ${fromToken?.symbol} to ${toToken?.symbol}, interchain's melody blends,
Cosmic harmonies, interchain's song transcends.`,
      condition: toChain?.networkName?.toLowerCase().includes('stride') || false
    },
    {
      text: `Tokens in motion, cosmic runners on track,
Squid's interchain race, never looking back.
Challenges arise, but with Stride's cosmic guide,
Tokens conquer all, taking it in stride.`,
      condition: toChain?.networkName?.toLowerCase().includes('stride') || false
    },
    {
      text: `In the cosmic ocean, Kujira reigns supreme,
Tokens dive and soar, in interchain dream.
Through interchain currents, Kujira guides the way,
Cosmic depths explored, a grand interchain display.`,
      condition: toChain?.networkName?.toLowerCase().includes('kujira') || false
    },
    {
      text: `Cronos, the cosmic clock, its hands in constant spin,
Tokens flow through Squid, as cosmic stories begin.
Interchain timelines, where past and future unite,
Synchronicity in Cronos' cosmic light.`,
      condition: toChain?.networkName?.toLowerCase().includes('cronos') || false
    },
    {
      text: `Time's symphony, Cronos sets the pace,
Tokens harmonize, interchain's cosmic embrace.
With each passing moment, melodies entwine,
Squid orchestrates in a celestial design.`,
      condition: toChain?.networkName?.toLowerCase().includes('cronos') || false
    },
    {
      text: `A symphony of secrecy, Secret's subtle cue,
Tokens whisper in harmony, interchain's debut.
Through hidden notes, melodies take flight,
Interchain secrets, cosmic harmony ignites.`,
      condition: toChain?.networkName?.toLowerCase().includes('secret') || false
    },
    {
      text: `Whispered in murmurs, known by a select few,
Tokens clandestine, in Secret they ensue.
Through interchain whispers, secrets softly flow,
Squid confidentiality, a hushed, mystic glow.`,
      condition: toChain?.networkName?.toLowerCase().includes('secret') || false
    },
    {
      text: `Stargaze, the cosmic spectacle, a delightful sight,
Tokens twinkle and shimmer, in blockchain light.
In the interstellar ballet, they gracefully amaze,
Stargaze's cosmic theater, where interchain dreams blaze.`,
      condition: toChain?.networkName?.toLowerCase().includes('stargaze') || false
    },
    {
      text: `With Squid, to Stargaze is a delightful sight
Tokens twinkle and shimmer, in the Cosmos light.
Interchain galaxy they explore and roam,
Stargaze's cosmic vista, now their home.`,
      condition: toChain?.networkName?.toLowerCase().includes('stargaze') || false
    },
    {
      text: `Sommelier, the wine connoisseur, tasting with finesse,
Tokens swirl in Squid's glasses, the blockchain's best.
With cosmic flavors, they tantalize and excite,
Sommelier's interchain pairings, a cosmic delight.`,
      condition: toChain?.networkName?.toLowerCase().includes('sommelier') || false
    },
    {
      text: `Sommelier, wine maestro of the blockchain vine,
Tokens savor the notes, across cosmic time,
In web3 vineyards, their essence entwined,
Squid's interchain symphony, an eternal find.`,
      condition: toChain?.networkName?.toLowerCase().includes('sommelier') || false
    },
    {
      text: `Agoric, the cosmic marketplace, bustling with trades,
Tokens exchange hands, in interchain parades.
Cosmic commerce thrives, in Agoric's grand bazaar,
Interchain transactions, reaching near and far.`,
      condition: toChain?.networkName?.toLowerCase().includes('agoric') || false
    },
    {
      text: `Crescent, the cosmic luminary, shining so bright,
Tokens bask in its glow, through the interchain night.
With cosmic radiance, they find their course,
Crescent's blockchain beacon, a guiding force.`,
      condition: toChain?.networkName?.toLowerCase().includes('crescent') || false
    },
    {
      text: `In interchain's symphony, Crescent's glow,
Tokens harmonize, cosmic melodies flow.
With each crescent phase, melodies renew,
Interchain harmony, cosmic interplay ensue.`,
      condition: toChain?.networkName?.toLowerCase().includes('crescent') || false
    },
    {
      text: `Through interchain challenges, we face them as one,
Umee, interchain ally, our cosmic journey begun.
With Squid synergy, we navigate the unknown,
Together, you and me, our interchain story is sown.`,
      condition: toChain?.networkName?.toLowerCase().includes('umee') || false
    },
    {
      text: `In interchain moments, it's Squid & Umee,
Exploring the cosmos, boundless and free.
Squid's guiding light, our celestial guide,
Interchain unity, with Umee by my side.`,
      condition: toChain?.networkName?.toLowerCase().includes('umee') || false
    },
    {
      text: `Liquidity's symphony, Evmos takes the lead,
Tokens resonate in harmony, interchain's agreed.
Through interchain whispers, melodies unfold,
Evmos conducts, cosmic interchain's threshold`,
      condition: toChain?.networkName?.toLowerCase().includes('evmos') || false
    },
    {
      text: `Through interchain realms, Evmos whispers low,
Tokens seek cosmic answers, to quench their thirst to know.
In Squid's swapping chamber, mysteries unfurl,
Interchain enlightenment, the secrets of the world.`,
      condition: toChain?.networkName?.toLowerCase().includes('evmos') || false
    },
    {
      text: `Persistence, interchain's unwavering might,
Tokens journey forth, in Squid-powered flight.
Through interchain landscapes, they push on,
Persistence's cosmic spirit, forever strong.`,
      condition: toChain?.networkName?.toLowerCase().includes('persistence') || false
    },
    {
      text: `Persistence, the cosmic flame that burns,
Tokens traverse interchain, at every turn.
With unwavering determination, they rise,
Squid powering persistence it reaches the skies.`,
      condition: toChain?.networkName?.toLowerCase().includes('persistence') || false
    },
    {
      text: `In the interchain realm, tokens find their way,
Guided by Squid to where stars hold sway.
Through cosmic constellations, they chart their course,
From ${fromToken?.symbol} to ${toToken?.symbol}, a celestial force.`,
      condition: toChain?.chainType === ChainType.COSMOS
    },
    {
      text: `In interchain's symphony, Kujira takes the stage,
Tokens dance in harmony, cosmic notes engage.
Through cosmic waters, melodies traverse,
Kujira guides, interchain's cosmic universe.`,
      condition: toChain?.networkName?.toLowerCase().includes('kujira') || false
    },
    {
      text: `A cosmic symphony, Axelar's cosmic score,
Tokens unite in harmony, interchain's rapport.
From ${fromToken?.symbol} to ${toToken?.symbol}, a melodious exchange,
Squid orchestrates, interchain's cosmic range.`,
      condition: toChain?.networkName?.toLowerCase().includes('axelar') || false
    },
    {
      text: `Cosmic interplay, Axelar leads the way,
Tokens blend their voices, in interchain's ballet.
With interchain movements, harmony unfolds,
Squid's cosmic baton, interchain's stories told.`,
      condition: toChain?.networkName?.toLowerCase().includes('axelar') || false
    },
    {
      text: `In interchain's tapestry, Axelar's thread,
Tokens entwine, cosmic harmony spread.
Through interchain connections, melodies ignite,
Axelar's cosmic composition, interchain's delight.`,
      condition: toChain?.networkName?.toLowerCase().includes('axelar') || false
    },
    {
      text: `In Axelar's cosmic web, tokens unite,
Interchain pathways merge, with cosmic light.
From ${fromToken?.symbol} to ${toToken?.symbol}, harmonies resonate,
Axelar's cosmic bridges, interchain's fate.`,
      condition: toChain?.networkName?.toLowerCase().includes('axelar') || false
    }
  ]

  const filteredPosts = postOptions.filter(t => t.condition)
  const randomPost = filteredPosts[Math.floor(Math.random() * filteredPosts.length)]
  const postContent = prefix + (randomPost?.text ?? '')
  return postContent
}
