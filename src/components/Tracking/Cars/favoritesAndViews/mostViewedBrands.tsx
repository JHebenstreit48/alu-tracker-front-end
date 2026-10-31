import type { ViewedBrand } from '@/types/Tracking/viewedItems';

type MostViewedBrandsProps = {
  brands: ViewedBrand[];
};

export default function MostViewedBrands({ brands }: MostViewedBrandsProps) {
  return (
    <>
      <h3 className="viewsSubTitle">Top Brands</h3>

      <table className="viewsBrandTable">
        <thead>
          <tr>
            <th>Brand</th>
            <th>Views</th>
          </tr>
        </thead>
        <tbody>
          {brands.map(({ brand, views }) => (
            <tr key={brand}>
              <td className="viewsBrandName">{brand}</td>
              <td className="viewsCount">
                {views} view{views === 1 ? '' : 's'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}