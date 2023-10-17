<script
	setup
	lang="ts"
>
import {useContactsStore} from "~/store/contacts";

const {$state} = useContactsStore()
</script>

<template>
	<aside :class="$style.SideBar">
		<div :class="$style.logo">
			<UiVIcon
				name="logo"
				size="large"
			/>
		</div>
		<div :class="$style.socialWrap">
			<a
				v-for="(item, ind) in $state"
				:key="ind"
				:href="item.link"
				target="_blank"
				rel="noreferrer"
				:class="$style.socialLink"
			>
				<UiVIcon
					:name="item.icon"
					size="big"
				/>
			</a>
		</div>
	</aside>
</template>

<style
	lang="scss"
	module
>
	.SideBar {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 10;
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 13rem;
		height: 100vh;
		padding: 5.6rem 0;
		border-right: 1px solid $gray5;
		background: $gray1;
		flex-direction: column;

		@include respond-to(mobile) {
			display: none;
		}
	}

	.socialWrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3rem;

		a {
			height: 4rem;
		}
	}

	.socialLink  {
		width: 4rem;
		height: 4rem;
		color: $gray5;
		transition: $default-transition;

		&:hover {
			color: $gray2;
			filter: drop-shadow(1px 1px 10px $black);
			transform: scale(1.2);
		}
	}
</style>
