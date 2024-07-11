import clockIcon from "@/images/thank you/clock.svg?url"
import computerIcon from "@/images/thank you/computer.svg?url"
import countonusIcon from "@/images/thank you/countonus.svg?url"
export const cards = [
    {
      title: "Wait for a call",
      info: "You can expect to receive a call from one of our loan advisors within one business day. We will discuss your business needs and the best loan options for your business objectives. This is your chance to ask any questions about the type of business loan you need and the terms of the loan.",
      src: clockIcon,
      bolds:[],
      alt: "Phone icon",
    },
    {
      title: "Finalize your application",
      info: `To finalize your application, we need to examine your most up-to-date business checking account activity for the past 90 days. For instructions on downloading your bank statements, please visit your bank's website or Google, "how to download [bank name] bank statements".`,
      src: computerIcon,

      bolds:[],

      alt: "Dicussion icon",
    },
    {
      title: "Count on us",
      info: "We're here for you if you need anything throughout the lending process. Feel free to call us or send an email with any questions or concerns to hello@ridgecrestfg.com and we'll get back to you as soon as possible.",
      src: countonusIcon,
      bolds:[],
      email:['hello@ridgecrestfg.com'],
      alt: "Hands icon",

    },
  ];