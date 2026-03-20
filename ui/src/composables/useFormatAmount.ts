import { useQuery } from '@vue/apollo-composable'
import { computed } from 'vue'
import { graphql } from '@/graphql'

const MeForCurrency = graphql(`
  query MeForCurrency {
    me {
      defaultCurrency {
        symbol
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

  function formatAmount(minorUnits: number): string {
    const symbol = defaultCurrency.value?.symbol ?? '$'
    const decimals = defaultCurrency.value?.minorUnits ?? 2
    const divisor = 10 ** decimals
    return `${symbol}${(minorUnits / divisor).toFixed(decimals)}`
  }

  return { formatAmount, defaultCurrency }
}
