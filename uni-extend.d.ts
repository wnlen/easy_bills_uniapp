// uni-extend.d.ts
export {};

declare namespace UniNamespace {
	interface Uni {
		/** APP 一键登录（你在 global.js 里挂到 uni.$univerify 的那个） */
		$univerify?: (data?: any) => void;

		/** 统一导航封装（nav.ts 挂到 uni.$nav） */
		$nav?: {
			to: (url: string, params?: Record<string, any>) => void;
			tab: (url: string) => void;
			replace: (url: string, params?: Record<string, any>) => void;
			launch: (url: string, params?: Record<string, any>) => void;
			back: (delta?: number) => void;
		};
	}
}
