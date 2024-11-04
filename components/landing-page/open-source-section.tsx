import { Typography } from '../ui/typography';
import { SectionBlock } from './section-block-wrapper';

export const OpenSourceSection = () => {
  return (
    <SectionBlock title='open source code'>
      <Typography variant='h5'>
        Our code is fully open-source, allowing complete transparency into how the app works behind
        the scenes. You’re welcome to explore the repository, make suggestions, and contribute
        through pull requests or issues. Let’s build a better tool together!
      </Typography>
    </SectionBlock>
  );
};
