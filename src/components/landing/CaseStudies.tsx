import {
  ButtonLink,
  ComingSoon,
  SectionTitle,
  classNames,
} from './SharedComponents';

export function CaseStudies() {
  return (
    <section className="container max-w-4xl my-36">
      <div className="flex flex-col m-auto mt-12 gap-24">
        <SectionTitle>Built with Stately</SectionTitle>

        <div className="flex flex-col md:flex-row gap-4 md:gap-12 max-w-2xl">
          <img
            className="h-24 md:h-36 self-start"
            src="/assets/landing/fugo-logo.svg"
            alt={`Fugo`}
          />
          <Quote
            quote="I can explain business logic to stakeholders using simulation in Stately Editor. After a long time away from coding, I can return and effectively understand the logic."
            quoter="Marsel Atniashev"
            href="https://stately.ai/blog/2023-12-04-fugo-and-stately-case-study"
          />
        </div>

        <div className="flex flex-col gap-4 max-w-xl self-end">
          <div>
            <img
              className="h-24 w-auto"
              src="/assets/landing/koordinates-logo.svg"
              alt={`Koordinates`}
            />
          </div>
          <Quote
            quote="I love the first class support in XState for side effects. That the side effects can be co-located with my code that triggers it and uses it, instead of having to put them somewhere else like with Redux"
            quoter="Taylor Lodge"
            href="https://stately.ai/blog/2023-11-28-koordinates-and-stately-case-study"
          />
        </div>

        <div className="flex flex-col-reverse md:flex-row gap-4 md:gap-12 max-w-2xl">
          <Quote
            quoter="Parker McMullin"
            quote="I was able to showcase the machine visualizer to the rest of the company, which was a delight. This helped convey the complexity of the UI pieces, and also helped to discuss how we should handle specific use cases in conjunction with the design mockups."
            href="https://stately.ai/blog"
          />

          <img
            className="h-24 md:h-36 self-start"
            src="/assets/landing/tidefi-logo.svg"
            alt={`Tidefi`}
          />
        </div>
      </div>
    </section>
  );
}

function Quote({
  quote,
  href,
  quoter,
}: {
  quote: string;
  quoter: string;
  href: string;
}) {
  return (
    <div>
      <p className="text-white/90 mt-4 font-medium text-lg md:text-xl lg:text-2xl">
        “{quote}”
      </p>
      <p className="text-white/60 mt-4 mb-8 font-semibold">- {quoter}</p>
      <ButtonLink href={href} target="_blank" size="medium">
        Read case study
      </ButtonLink>
    </div>
  );
}
