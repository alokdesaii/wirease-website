import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Hero from "@/components/home/Hero";
import Credentials from "@/components/home/Credentials";
import Solutions from "@/components/home/Solutions";
import Rails from "@/components/home/Rails";
import Trust from "@/components/home/Trust";
import Stats from "@/components/home/Stats";
import FinalCta from "@/components/home/FinalCta";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Credentials />
        <Solutions />
        <Rails />
        <Trust />
        <Stats />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
