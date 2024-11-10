import { Typography } from '../ui/typography';
import { SectionBlock } from './section-block-wrapper';

// TODO: Try to make sharper the image at least in > 1280px
// Maybe using the png version isntead of webp?
export const OpenSourceSection = () => {
  return (
    <SectionBlock title='open source code' className='px-0'>
      <div className='mx-auto w-full'>
        <Typography variant='h5' className='container'>
          The code is fully open-source, allowing complete transparency into how the app works
          behind the scenes. You’re welcome to explore the repository, make suggestions, and
          contribute through pull requests or issues. Let’s build a better tool together!
        </Typography>
        <div className='titled-image-container h-[300px] rounded-lg contain-strict md:h-[550px] xl:h-[700px]'>
          <a
            href='https://github.com/pablo-aviles-prieto/expense-tracker'
            target='_blank'
            rel='noopener noreferrer'
            className='tilted-image relative block w-[800px] rounded-lg md:w-full'
          >
            <img
              className='mt-24 w-full rounded-lg md:mt-36 xl:mt-[160px]'
              src='/images/landing/repo.webp'
              alt='Expense tracker github repository'
            />
          </a>
        </div>
      </div>
    </SectionBlock>
  );
};
