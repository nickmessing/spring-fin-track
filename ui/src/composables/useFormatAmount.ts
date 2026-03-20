import { useQuery } from '@vue/apollo-composable'
import { computed } from 'vue'
import { graphql } from '@/graphql'

const MeForCurrency = graphql(`
  query MeForCurrency {
    me {
      id
      defaultCurrency {
        code
        minorUnits
      }
    }
  }
`)

export function useFormatAmount() {
  const { current } = useQuery(MeForCurrency)

  const defaultCurrency = computed(() =>
    current.value.resultState === 'complete' && current.value.result.me
      ? current.value.result.me.defaultCurrency
      : null,
  )

  const formatter = computed(() => {
    const code = defaultCurrency.value?.code ?? 'USD'
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: code,
    })
  })

  function formatAmount(minorUnits: number): string {
    const decimals = defaultCurrency.value?.minorUnits ?? 2
    const divisor = 10 ** decimals
    return formatter.value.format(minorUnits / divisor)
  }

  const formattersCache = new Map<string, Intl.NumberFormat>()

  function getFormatter(currencyCode: string): Intl.NumberFormat {
    let fmt = formattersCache.get(currencyCode)
    if (!fmt) {
      fmt = new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: currencyCode,
      })
      formattersCache.set(currencyCode, fmt)
    }
    return fmt
  }

  function formatAmountWithCurrency(minorUnits: number, currencyCode: string): string {
    const fmt = getFormatter(currencyCode)
    const decimals = fmt.resolvedOptions().maximumFractionDigits ?? 2
    return fmt.format(minorUnits / 10 ** decimals)
  }

  return { formatAmount, formatAmountWithCurrency, defaultCurrency }
}
