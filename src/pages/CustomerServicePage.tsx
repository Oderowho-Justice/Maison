import { ServiceHero } from "../components/ServiceHero";
import { CustomerService } from "../components/CustomerService";
export function CustomerServicePage({ openCraft }: { openCraft: () => void }) {
  return (
    <>
      <ServiceHero openCraft={openCraft} />
      <CustomerService />
    </>
  );
}
