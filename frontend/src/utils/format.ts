export const formatCurrency = (val: string | number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(val))

export const formatDate = (val: string) =>
  new Date(val).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

export const formatDateTime = (val: string) =>
  new Date(val).toLocaleString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

export const formatNumber = (val: string | number) =>
  new Intl.NumberFormat("en-IN").format(Number(val))
