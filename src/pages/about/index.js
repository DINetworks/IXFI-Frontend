import { Box, Typography } from '@mui/material'
import { teamMembers } from 'src/configs/constant'

const About = () => {
  return (
    <section className='section_header-text-image'>
      <Box className='container-large' px={4}>
        <Typography variant='h1' fontWeight='bold' textAlign='center' className='text-gradient-light-pink-lilac' mb={4}>
          About Our Team
        </Typography>
        <Box fontSize='1.5rem' lineHeight='2rem' textAlign='justify'>
          <Box mb={2}>
            Our core team consists of seasoned professionals with extensive experience in both Web2 and Web3
            development. With a deep understanding of blockchain infrastructure, we have successfully built and
            contributed to various decentralized applications, including cross-chain DEXs and DEX aggregators.{' '}
          </Box>
          <Box mb={2}>
            Our team members have worked on projects that facilitate seamless token swaps across multiple blockchains,
            leveraging protocols like Uniswap, 1inch, and ThorChain.{' '}
          </Box>
          <Box mb={2}>
            We have also designed DEX aggregators that optimize trade execution by sourcing liquidity from multiple
            decentralized exchanges, ensuring users receive the best possible rates with minimal slippage. (on Kyberswap
            protocol) With this expertise, IXFI is positioned to deliver a next-generation interoperability solution
            that enhances cross-chain asset transfers while maintaining security, efficiency, and decentralization.
          </Box>
        </Box>
        <Typography variant='h1' fontWeight='bold' textAlign='center' className='text-gradient-light-pink-lilac' my={8}>
          Experience
        </Typography>
        <Box>
          <Box fontSize='1.25rem'>DEX Aggregators & Cross Chain Swap</Box>
          <Box fontSize='1.25rem'>Lending & Borrowing Platform</Box>
          <Box fontSize='1.25rem'>Governance & DAO Platforms</Box>
          <Box fontSize='1.25rem'>Cross Chain Messaging</Box>
        </Box>
        <Typography variant='h1' fontWeight='bold' textAlign='center' className='text-gradient-light-pink-lilac' my={8}>
          Lending & Borrowing Platform
        </Typography>
        <Box>
          <Box fontSize='1.25rem'>
            - Blockchain & Smart Contract: Solidity/Vyper, Go/Rust, Foundry/Hardhat, Viem/Ethers
          </Box>
          <Box fontSize='1.25rem'>- Backend: Go/Rust, Node.js+Express.js, Python/Django</Box>
          <Box fontSize='1.25rem'>- FrontEnd: Next.js + Mui + Wagmi</Box>
        </Box>
        <Box></Box>
        <Typography variant='h1' fontWeight='bold' textAlign='center' className='text-gradient-light-pink-lilac' my={8}>
          Core Members
        </Typography>
        <Box className='w-layout-grid cards-small_component margin-bottom margin-large' mx={2}>
          <div className='w-layout-grid cards-small_row'>
            {teamMembers.map((member, index) => (
              <div key={index} className='card is-pro'>
                <div className='card-content is-medium'>
                  <div className='cards-small_card-content-top'>
                    <Box className='cards-small_icon-wrapper-wrapper' mt={4} mb={6}>
                      <img src={member.photo} alt='' className='member-photo' />
                    </Box>
                    <div className='margin-bottom margin-xsmall'>
                      <h5 className='heading-style-h5 text-center'>{member.name}</h5>
                    </div>
                    <Box textAlign='center' fontSize={'1.25rem'}>
                      {member.role}
                    </Box>
                    <Box textAlign='center' fontSize={'1.25rem'}>
                      {member.position}
                    </Box>
                    <Box display='flex' alignItems='center' justifyContent='center' gap={2} mt={4}>
                      {member.socials.x && (
                        <a target='_blank' className='social-icon' href={`https://x.com/${member.socials.x}`}>
                          <img src='/images/icons/twitter.svg' alt='' />
                        </a>
                      )}
                      {member.socials.in && (
                        <a
                          target='_blank'
                          className='social-icon'
                          href={`https://linkedin.com/in/${member.socials.in}`}
                        >
                          <img src='/images/icons/linkedin.svg' alt='' />
                        </a>
                      )}
                    </Box>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Box>
      </Box>
    </section>
  )
}

export default About
