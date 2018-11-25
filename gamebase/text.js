// Text Module
GameBase.Text = [];

// Variables
GameBase.Text.Vars = [];
GameBase.Text.Vars.Font = "";
GameBase.Text.Vars.Fonts = [];
GameBase.Text.Vars.Size = 20;
// Enums
GameBase.Text.Enums = [];
GameBase.Text.Enums.Left = 0;
GameBase.Text.Enums.Centre = 1;
GameBase.Text.Enums.Right = 2;
GameBase.Text.Enums.Top = 3;
GameBase.Text.Enums.Bottom = 4;

// Registers a font
GameBase.Text.RegisterFont = function( name, vars ) {
	this.Vars.Fonts[name] = vars;
}
// Checks if a font is valid
GameBase.Text.IsValidFont = function( name ) {
	if ( this.Vars.Fonts[name] == null ) {
		return false;
	} else {
		return true;
	}
}
// Sets the current font
GameBase.Text.SetFont = function( font ) {
	if ( this.IsValidFont( font ) ) {
		this.Vars.Font = font;
	}
}
// Returns the current font
GameBase.Text.GetFont = function() {
	if ( this.IsValidFont( this.GetFontName() ) ) {
		return this.Vars.Fonts[this.Vars.Font];
	}
	return null;
}
// Returns the current font name
GameBase.Text.GetFontName = function() {
	return this.Vars.Font;
}
// Sets the size of the font
GameBase.Text.SetSize = function( size ) {
	this.Vars.Size = size;
}
// Returns the current text size
GameBase.Text.GetSize = function() {
	return this.Vars.Size;
}
// Returns the width of the given text
GameBase.Text.GetTextWidth = function( text ) {
	var font = this.GetFont();
	if ( font != null ) {
		var scale = this.GetSize()/font.CharH;
		return text.length * font.CharW * scale;
	}
}
// Draws text
GameBase.Text.DrawText = function( x, y, text, x_align, y_align ) {
	var font = this.GetFont();
	text = String( text );
	if ( font != null ) {
		if ( x_align === undefined ) {
			x_align = this.Enums.Left;
		}
		if ( y_align === undefined ) {
			y_align === this.Enums.Top;
		}
		var x_offset = 0;
		var y_offset = 0;
		var scale = this.GetSize()/font.CharH;
		// X Align
		if ( x_align == this.Enums.Centre ) {
			x_offset = ( -font.CharW * (text.length/2) ) * scale;
		} else if ( x_align == this.Enums.Right ) {
			x_offset = ( -font.CharW * text.length ) * scale;
		}
		// Y Align
		if ( y_align == this.Enums.Centre ) {
			y_offset = ( -font.CharH/2 ) * scale + 1;
		} else if ( y_align == this.Enums.Bottom ) {
			y_offset = ( -font.CharH ) * scale;
		}
		// Start Drawing
		_r.push();
		_r.translate( x+x_offset, y+y_offset );
		for ( i = 0; i < text.length; i++ ) {
			var pos = font.Charset.indexOf( text.substring( i, i+1 ) );
			if ( pos != null ) {
				var x = pos*font.CharW;
				_r.rect( i*font.CharW*scale, 0, font.CharW*scale, font.CharH*scale, font.Texture, x/font.TextureW, 0, (x+font.CharW)/font.TextureW, 1 );
				// _r.rect UV mapping is borked
				//_r.quad( i*font.CharW*scale, 0, x/font.TextureW, 0,
				//(i+1)*font.CharW*scale, 0, (x+font.CharW)/font.TextureW, 0,
			 	//(i+1)*font.CharW*scale, font.CharH*scale, (x+font.CharW)/font.TextureW, 1,
				//i*font.CharW*scale, font.CharH*scale, x/font.TextureW, 1, font.Texture );
			}
		}
		_r.pop();
	}
}
// Registers a font
GameBase.Text.RegisterFont( "Mplus1m SemiBold", {
	Texture: assets["font_mplus1m_semibold.tex"],
	TextureW: 2850,
	TextureH: 64,
	CharW: 30,
	CharH: 64,
	Charset: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,!?\"':;<>()[]{}#~@/\\$%^&*-_=+|`"
} )
// Registers a font
GameBase.Text.RegisterFont( "Mplus1m Bold", {
	Texture: assets["font_mplus1m_bold.tex"],
	TextureW: 2850,
	TextureH: 64,
	CharW: 30,
	CharH: 64,
	Charset: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,!?\"':;<>()[]{}#~@/\\$%^&*-_=+|`"
} )
// Registers a font
GameBase.Text.RegisterFont( "Mplus1m Light", {
	Texture: assets["font_mplus1m_light.tex"],
	TextureW: 2850,
	TextureH: 64,
	CharW: 30,
	CharH: 64,
	Charset: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,!?\"':;<>()[]{}#~@/\\$%^&*-_=+|`"
} )
// Registers a font
GameBase.Text.RegisterFont( "Mplus1m Thin", {
	Texture: assets["font_mplus1m_thin.tex"],
	TextureW: 2850,
	TextureH: 64,
	CharW: 30,
	CharH: 64,
	Charset: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,!?\"':;<>()[]{}#~@/\\$%^&*-_=+|`"
} )
// Registers a font
GameBase.Text.RegisterFont( "Mplus1m", {
	Texture: assets["font_mplus1m.tex"],
	TextureW: 2850,
	TextureH: 64,
	CharW: 30,
	CharH: 64,
	Charset: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,!?\"':;<>()[]{}#~@/\\$%^&*-_=+|`"
} )
