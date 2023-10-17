<script setup lang="ts">
import {computed, useCssModule} from "vue";

const $style = useCssModule()

const props = defineProps({
    name: {
        type: String,
        required: true,
    },

    size: {
        type: String,
        default: 'medium',
        validator: v => [
            'small',
            'medium',
            'large',
            'big',
            'logo',
            'custom',
        ].includes(<string>v),
    },
})

// Computed
const classList = computed(() => {
    return [
        {
            [$style[`_${props.size}`]]: props.size,
        },
    ]
})

const tag = computed(() => {
    return `svgo-${props.name}`
})
</script>

<template>
    <component
        :is="tag"
        :name="name"
        :class="[$style.VIcon, classList]"
        filled
        :fontControlled="false"
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
