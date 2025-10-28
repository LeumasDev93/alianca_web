export default function Page() {
  return (
    <div className=" flex justify-center items-center">
      <div className="w-full h-[100vh] rounded-lg overflow-hidden">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3425.3350086668443!2d-23.52106020344467!3d14.907511605891845!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x93599001975e211%3A0xa3c46090f758c654!2sAlian%C3%A7a%20Seguros!5e1!3m2!1spt-PT!2scv!4v1743760388029!5m2!1spt-PT!2scv"
          width="100%"
          height="100%"
          style={{ border: "0" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}
