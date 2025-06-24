import { Box, Typography } from '@mui/material'
import { teamMembers } from 'src/configs/constant'

const About = () => {
  return (
    <section className='section_header-text-image'>
      <Box className='container-large' px={4}>
        <h3 className='text-gradient-light-pink-lilac text-center'>About Our Team</h3>
        <Box fontSize='1.5rem' lineHeight='2rem' textAlign='justify' mt={8} mb={20}>
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
        <h3 className='text-gradient-light-pink-lilac text-center'>Experience</h3>
        <Box className='w-layout-grid' mt={8} mb={20}>
          <Box className={`card is-tabitem-pro w-tab-link`}>
            <Box className='card-content is-small'>
              <h5 className='heading-style-h5'>
                <strong>DEX Aggregators & Cross Chain Swap</strong>
              </h5>
            </Box>
          </Box>
          <Box className={`card is-tabitem-pro w-tab-link`}>
            <Box className='card-content is-small'>
              <h5 className='heading-style-h5'>
                <strong>Lending & Borrowing Platform</strong>
              </h5>
            </Box>
          </Box>
          <Box className={`card is-tabitem-pro w-tab-link`}>
            <Box className='card-content is-small'>
              <h5 className='heading-style-h5'>
                <strong>Governance & DAO Platforms</strong>
              </h5>
            </Box>
          </Box>
          <Box className={`card is-tabitem-pro w-tab-link`}>
            <Box className='card-content is-small'>
              <h5 className='heading-style-h5'>
                <strong>Cross Chain Messaging</strong>
              </h5>
            </Box>
          </Box>
        </Box>
        <h3 className='text-gradient-light-pink-lilac text-center'>Main Tech Stacks</h3>
        <Box mt={8} mb={20}>
          <Box fontSize='1.5rem'>
            - Blockchain & Smart Contract: Solidity/Vyper, Go/Rust, Foundry/Hardhat, Viem/Ethers
          </Box>
          <Box fontSize='1.5rem'>- Backend: Go/Rust, Node.js+Express.js, Python/Django</Box>
          <Box fontSize='1.5rem'>- FrontEnd: Next.js + Mui + Wagmi</Box>
        </Box>
        <Box></Box>
        <h3 className='text-gradient-light-pink-lilac text-center'>Core Members</h3>
        <Box className='w-layout-grid cards-small_component' mt={8} mb={20}>
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
