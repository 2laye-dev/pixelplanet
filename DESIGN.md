# Pixel Planet visual contract

The user's explicit Sybiosme reference overrides alternative concept selection. Rebuild the observed full-bleed graphite, dot-screen surface, chrome sculpture, vivid orange circular-arrow controls, oversized bottom wordmark, rounded black approach panel, scroll-led project stage and roomy typography. Preserve Persian RTL readability. Original geometry and implementation; no Sybiosme branding or subscription claims.

Palette: graphite #727371, ink #131412, silver #e7e8e3, paper #fafaf5, orange #ff5100. Display: local Estedad variable (Persian) and locally bundled Manrope (Latin if available); utility uses the same text family. Single signature: sculptural metallic pixel planet, reacting to pointer and scroll, dissolving into the project stage. No gradients in text, metrics, invented clients or results.

Hero composition: restrained floating brand/navigation → concise Persian offer on right with open center for WebGL sculpture → wide PIXEL PLANET wordmark anchored to viewport bottom. Approach in black inset slab. Services are large typographic rows with contextual work filters. Selected projects use a spatial, horizontal browsing stage with real screenshots where accessible. Contact is an orange closing surface and actual form.

Project previews use fresh 1440×900 desktop captures inside flat 16:10 browser windows. Screenshots use `contain`, with no zoom or crop, and the earlier laptop-like perspective tilt is removed. Horizontal browsing and the next-project cue remain.

Admin is a quiet operational surface using shared colors and type; labels, validation, draft/publish, category selection, sort, image upload and inbox. Keyboard, reduced motion and WebGL fallback are first-class. Mobile uses horizontal snap browsing, bounded sizes and no hover-only controls.

## Reference motion refinement

The background uses a full viewport WebGL halftone pass: offscreen metallic geometry luminance controls the dot diameters, with a slowly moving monochrome wave field. After the hero the background becomes dark ambient halftone. Rendering is capped at 30 fps, pauses in hidden tabs, and becomes static for reduced-motion users. A CSS dot field remains if WebGL is unavailable.

Navigation expands from the four-dot button into a 318px charcoal corner panel, with staggered rows, active location, dimmed backdrop, shifted toolbar, Escape/outside closure and keyboard cycling. Mobile uses a 290px panel.

The process section spans 440svh and pins a viewport-sized stage. Scroll progress changes the introduction and three project stages in place, alongside a projected cylindrical dot ruler. A skip link leads to the FAQ. Reduced motion displays ordinary stacked articles. No invented delivery deadlines.

During the pinned process sequence, a localized translucent charcoal surface quiets only the animated halftone behind the stage. The ruler and copy remain crisp above it, with stronger secondary-text contrast and restrained text shadows improving Persian readability without adding a visible card. The treatment avoids full-viewport backdrop filtering so the WebGL composition stays reliable and inexpensive.

## Persian typography

Selected family: Estedad Variable by Amin Abedi, locally hosted WOFF2 version 8.5 (128,304 bytes), verified with the font metadata parser included in Next.js. Real wght axis: 100–900. Its compact geometry suits Pixel Planet's technology direction while retaining Persian reading clarity. Evaluated Vazirmatn (more neutral UI emphasis) and Mikhak (semi-handwriting character); Estedad remains the deliberate choice.

Declare the full 100–900 range in next/font/local, preload one local asset, disable synthetic font weight, and use 430 body / 520 interface / 620 process / 640 section headings / 720 hero. Keep Persian letter spacing normal to preserve joined letterforms. Admin uses the same family. Latin wordmarks retain Manrope. No third-party font request at runtime.

Official source: https://github.com/aminabedi68/Estedad — SIL Open Font License 1.1, included at public/fonts/Estedad-LICENSE.txt. Both bundled fonts' licenses are included in the release.
