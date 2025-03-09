<script setup lang="ts">
const $style = useCssModule()

const props = withDefaults(defineProps<{
    name: string,
    size?: 'small' | 'medium' | 'large' | 'big' | 'logo' | 'custom'
}>(), {
    size: 'medium',
})

// Computed
const classList = computed(() => {
    return [
        {
            [$style[`_${props.size}`]]: props.size,
        },
    ]
})
</script>

<template>
    <Icon
        :name="`icons:${props.name}`"
        :class="[$style.VIcon, classList]"
    />
</template>

<style lang="scss" module>
    .VIcon {
		&._custom {
			//
		}

        &._small {
            width: 1.2rem;
            height: 1.2rem;
        }

        &._medium {
            width: 2.4rem;
            height: 2.4rem;
        }

        &._big {
            width: 4rem;
            height: 4rem;
        }

		&._large {
			width: 8rem;
			height: 8rem;
		}

        &._logo {
            width: 20rem;
            height: 4rem;
        }
    }
</style>
