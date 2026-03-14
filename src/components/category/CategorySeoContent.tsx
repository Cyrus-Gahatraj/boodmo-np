interface CategorySeoContentProps {
  categoryName: string;
}

export function CategorySeoContent({ categoryName }: CategorySeoContentProps) {
  return (
    <div className="mt-10 space-y-8 border-t border-[#e2edf7] pt-8">
      <section>
        <h2 className="mb-2 text-lg font-semibold text-[#394b63]">
          About car maintenance parts
        </h2>
        <p className="text-sm leading-relaxed text-[#5a6b7d]">
          Regular maintenance of your car ensures longevity and safety. Quality
          replacement parts for servicing—such as filters, belts, spark plugs,
          and fluids—help keep your vehicle running smoothly. Factors like
          driving conditions, mileage, and manufacturer guidelines determine how
          often parts need to be replaced.
        </p>
      </section>
      <section>
        <h2 className="mb-2 text-lg font-semibold text-[#394b63]">
          When should car maintenance part be replaced?
        </h2>
        <ul className="list-inside list-disc space-y-1 text-sm text-[#5a6b7d]">
          <li>Engine oil and other fluids – as per schedule or mileage</li>
          <li>Battery – when it no longer holds charge or is older than 3–4 years</li>
          <li>Tires – when tread is worn or damaged</li>
          <li>Filters – air, oil, cabin – at recommended intervals</li>
          <li>Belts – timing and accessory – before they show wear or as per manual</li>
        </ul>
      </section>
      <section>
        <h2 className="mb-2 text-lg font-semibold text-[#394b63]">
          Our advantages
        </h2>
        <ul className="list-inside list-disc space-y-1 text-sm text-[#5a6b7d]">
          <li>Get a limited, revocable license to use our online platform</li>
          <li>Choose from a large number of quality aftermarket and OEM items</li>
          <li>Get updated and actual information about products and services</li>
          <li>Pay for the goods with international cards</li>
        </ul>
        <p className="mt-3 text-sm text-[#5a6b7d]">
          Do you have any problems with your car? Browse {categoryName} on boodmo
          to find the right parts and keep your vehicle in top condition.
        </p>
      </section>
    </div>
  );
}
